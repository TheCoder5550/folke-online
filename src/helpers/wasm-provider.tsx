import WASM_MODULE_URL from '../../folke-wasm-wrapper/output/folke-wasm-wrapper.wasm?url'
import ghc_wasm_jsffi from "../../folke-wasm-wrapper/output/ghc_wasm_jsffi.js";

import WASM_MODULE_FALLBACK_URL from '../../folke-wasm-wrapper/output/folke-wasm-wrapper-fallback.wasm?url'
import { default as ghc_wasm_jsffi_fallback } from "../../folke-wasm-wrapper/output/ghc_wasm_jsffi_fallback.js";

import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import { WASI, ConsoleStdout, OpenFile, File } from "@bjorn3/browser_wasi_shim";
import { proofToHaskellProof, unflattenProof } from "./proof-helper.js";

type HaskellInstance = WebAssembly.Instance & {
  exports: HaskellExports
}

interface HaskellExports {
  _initialize?: (() => unknown) | undefined;

  hs_init: (a: number, b: number) => void;
  malloc: (len: number) => number;
  free: (ptr: number) => void;
  
  my_fac: (n: number) => Promise<number>;
  checkJsonString: (ptr: number, len: number) => Promise<number>;

  memory: WebAssembly.Memory;
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

interface WasmContextType {
  validate: (proof: FlatProof) => Promise<null | CheckProofResult>;
  error: string | null;
}

const WasmContext = createContext<WasmContextType | null>(null)

type WasmProviderProps = React.PropsWithChildren;

export const WasmProvider = ({ children }: WasmProviderProps) => {
  const [hs, setHS] = useState<HaskellExports>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWasm(WASM_MODULE_URL, ghc_wasm_jsffi)
      .catch((reason: unknown) => {
        console.error("[WASM] Compile error:", reason);
        console.warn("[WASM] Using back-up wasm module without tail calls");
        return loadWasm(WASM_MODULE_FALLBACK_URL, ghc_wasm_jsffi_fallback);
      })
      .then(setHS)
      .catch((reason: unknown) => {
        const e = reason as string;
        setError(`Proof validation is not supported on your device! (${e})`);
      })
  }, []);

  const validate = useCallback(async (proof: FlatProof): Promise<null | CheckProofResult> => {
    if (error) {
      console.error("WebAssembly failed to start!");
      return null;
    }

    if (!hs) {
      console.error("WebAssembly not loaded yet");
      return null;
    }

    const unflattenedProof = unflattenProof(proof);
    const haskellJSON = proofToHaskellProof(unflattenedProof);
    const inputBytes = encoder.encode(JSON.stringify(haskellJSON));

    return new Promise((resolve, reject) => {
      withBytesPtr(hs, inputBytes, async (inputPtr, inputLen) => {
        const resultPtr: number = await hs.checkJsonString(inputPtr, inputLen);
        const outputBytes = new Uint8Array(hs.memory.buffer, resultPtr);
        const length = outputBytes.findIndex(b => b === 0);

        const resultBytes = new Uint8Array(hs.memory.buffer, resultPtr, length);
        const output = decoder.decode(resultBytes);
        const json = JSON.parse(output) as __CheckProofResultPartial;
        const proofStatus = {
          ...json,
          completed: json.correct,
        } as CheckProofResult;

        if (proofStatus.message && proofStatus.message.includes("Conclusion not reached")) {
          proofStatus.correct = true;
          proofStatus.completed = false;
        }

        resolve(proofStatus);
      }).catch(reject);
    });
  }, [ error, hs ]);

  const value = useMemo(() => ({
    validate,
    error,
  }), [ validate, error ]);

  return (
    <WasmContext value={value}>
      {children}
    </WasmContext>
  )
}

async function loadWasm(moduleUrl: string, jsffi: typeof ghc_wasm_jsffi) {
  const args: string[] = [];
  const env: string[] = [];
  const fds = [
    new OpenFile(new File([])),
    ConsoleStdout.lineBuffered(msg => console.log(`[WASI stdout] ${msg}`)),
    ConsoleStdout.lineBuffered(msg => console.warn(`[WASI stderr] ${msg}`)),
  ];
  const wasi = new WASI(args, env, fds);
  const jsffiExports = {};

  const wasm = await WebAssembly.compileStreaming(fetch(moduleUrl));
  const inst = await WebAssembly.instantiate(wasm, {
    "wasi_snapshot_preview1": wasi.wasiImport,
    "ghc_wasm_jsffi": jsffi(jsffiExports),
  }) as HaskellInstance;
  Object.assign(jsffiExports, inst.exports);
  wasi.initialize(inst);

  const hs = inst.exports;
  hs.hs_init(0, 0);

  return hs;
}

function useWasm() {
  const wasm = use(WasmContext)
  if (!wasm) {
    throw new Error('Missing WasmProvider')
  }
  return wasm;
}

export default useWasm;

const withBytesPtr = async (hs: HaskellExports, bytes: Uint8Array<ArrayBufferLike>, callback: (ptr: number, len: number) => Promise<void>) => {
  const len = bytes.byteLength
  const ptr = hs.malloc(len)
  try {
    new Uint8Array(hs.memory.buffer, ptr, len).set(bytes)
    await callback(ptr, len);
  } finally {
    hs.free(ptr)
  }
}