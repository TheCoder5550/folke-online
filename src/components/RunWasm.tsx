import { useEffect, useState } from "react"
import WASM_MODULE_URL from '../../folke-wasm-wrapper/output/folke-wasm-wrapper.wasm?url'
import ghc_wasm_jsffi from "../../folke-wasm-wrapper/output/ghc_wasm_jsffi.js";
import { WASI, ConsoleStdout, OpenFile, File } from "@bjorn3/browser_wasi_shim";
import { isStepLine } from "../helpers/proof-helper.js";
import { useProof } from "../helpers/ProofContext.js";

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

interface CheckProofResult {
  correct: boolean;
  message?: string;
  location?: number | string;
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export default function RunWasm() {
  const proof = useProof();
  const [hs, setHS] = useState<HaskellExports>();
  const [result, setResult] = useState<CheckProofResult>();

  useEffect(() => {
    async function loadWasm() {
      const args: string[] = [];
      const env: string[] = [];
      const fds = [
        new OpenFile(new File([])),
        ConsoleStdout.lineBuffered(msg => console.log(`[WASI stdout] ${msg}`)),
        ConsoleStdout.lineBuffered(msg => console.warn(`[WASI stderr] ${msg}`)),
      ];
      const wasi = new WASI(args, env, fds);
      const jsffiExports = {};

      const wasm = await WebAssembly.compileStreaming(fetch(WASM_MODULE_URL));
      const inst = await WebAssembly.instantiate(wasm, {
        "wasi_snapshot_preview1": wasi.wasiImport,
        "ghc_wasm_jsffi": ghc_wasm_jsffi(jsffiExports),
      }) as HaskellInstance;
      Object.assign(jsffiExports, inst.exports);
      wasi.initialize(inst);

      const hs = inst.exports;
      hs.hs_init(0, 0);

      setHS(hs);
      
      // console.log(inst);

      // const inputBytes = encoder.encode(exampleJSON);
      // await withBytesPtr(hs, inputBytes, async (inputPtr, inputLen) => {
      //   const resultPtr: number = await hs.checkJsonString(inputPtr, inputLen);
      //   const outputBytes = new Uint8Array(hs.memory.buffer, resultPtr);
      //   const length = outputBytes.findIndex(b => b === 0);

      //   const resultBytes = new Uint8Array(hs.memory.buffer, resultPtr, length);
      //   const output = decoder.decode(resultBytes);
      //   const json = JSON.parse(output) as CheckProofResult;

      //   console.log(json);
      // });
    }

    loadWasm().catch(console.error);
  }, []);

  const handleClick = () => {
    if (!hs) {
      console.error("WebAssembly not loaded yet");
      return;
    }

    const haskellJSON = proofToHaskellJSON(proof);
    console.log(haskellJSON);
    const inputBytes = encoder.encode(haskellJSON);

    withBytesPtr(hs, inputBytes, async (inputPtr, inputLen) => {
      const resultPtr: number = await hs.checkJsonString(inputPtr, inputLen);
      const outputBytes = new Uint8Array(hs.memory.buffer, resultPtr);
      const length = outputBytes.findIndex(b => b === 0);

      const resultBytes = new Uint8Array(hs.memory.buffer, resultPtr, length);
      const output = decoder.decode(resultBytes);
      const json = JSON.parse(output) as CheckProofResult;
      setResult(json);
    }).catch(console.error);
  }

  return (
    <div style={{ padding: "1rem" }}>
      {hs ? (
        <span>Wasm running</span>
      ) : (
        <span>Starting wasm...</span>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{result.correct ? "Correct" : "Incorrect"}</span>
          {!result.correct && (
            <span>{result.location} - {result.message}</span>
          )}
        </div>
      )}

      <button type="button" onClick={handleClick}>Check proof</button>
    </div>
  )
}

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

interface HaskellJSON {
  _sequent: {
    _conclusion: string;
    _premises: string[];
    _steps: HaskellStep[];
  }
}

type HaskellStep = {
  tag: "Line";
  _arguments: string[];
  _rule: string;
  _statement: string;
  _usedArguments: number;
} | {
  tag: "SubProof",
  contents: HaskellStep[]
}

function proofToHaskellJSON(proof: Proof): string {
  const convertStep = (step: Step): HaskellStep => {
    if (isStepLine(step)) {
      return {
        tag: "Line",
        _arguments: step.arguments,
        _usedArguments: step.usedArguments,
        _rule: step.rule,
        _statement: step.statement,
      }
    }
    else {
      return {
        tag: "SubProof",
        contents: step.steps.map(convertStep)
      }
    }
  };

  const data: HaskellJSON = {
    _sequent: {
      _conclusion: proof.conclusion,
      _premises: proof.premises,
      _steps: proof.steps.map(convertStep)
    },
  };

  return JSON.stringify(data);
}