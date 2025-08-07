import styles from "./ValidateButton.module.css";
import { useEffect, useState } from "react"
import WASM_MODULE_URL from '../../../folke-wasm-wrapper/output/folke-wasm-wrapper.wasm?url'
import ghc_wasm_jsffi from "../../../folke-wasm-wrapper/output/ghc_wasm_jsffi.js";
import { WASI, ConsoleStdout, OpenFile, File } from "@bjorn3/browser_wasi_shim";
import { proofToHaskellProof, unflattenProof } from "../../helpers/proof-helper.js";
import useProofStore from "../../stores/proof-store.js";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidErrorAlt } from "react-icons/bi";
import { MdHdrAuto } from "react-icons/md";

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

interface ValidateButtonProps {
  onValid?: () => void;
  autoValidate?: boolean;
  autoValidateMs?: number;
  small?: boolean;
}

export default function ValidateButton(props: ValidateButtonProps) {
  const proof = useProofStore((state) => state.proof);
  const [hs, setHS] = useState<HaskellExports>();
  const isCorrect = useProofStore((state) => state.result?.correct);
  const setResult = useProofStore((state) => state.setResult);

  const autoValidate = props.autoValidate !== false;
  const small = props.small === true;

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

  useEffect(() => {
    setResult(null);

    if (autoValidate) {
      const timeout = setTimeout(validate, props.autoValidateMs ?? 500);
      return () => {
        clearTimeout(timeout);
      }
    }
  }, [proof, hs]);

  const validate = () => {
    if (!hs) {
      console.error("WebAssembly not loaded yet");
      return;
    }

    const unflattenedProof = unflattenProof(proof);
    const haskellJSON = proofToHaskellProof(unflattenedProof);
    console.log(haskellJSON);
    const inputBytes = encoder.encode(JSON.stringify(haskellJSON));

    withBytesPtr(hs, inputBytes, async (inputPtr, inputLen) => {
      const resultPtr: number = await hs.checkJsonString(inputPtr, inputLen);
      const outputBytes = new Uint8Array(hs.memory.buffer, resultPtr);
      const length = outputBytes.findIndex(b => b === 0);

      const resultBytes = new Uint8Array(hs.memory.buffer, resultPtr, length);
      const output = decoder.decode(resultBytes);
      console.log(output);
      const json = JSON.parse(output) as CheckProofResult;
      setResult(json);

      if (json.correct) {
        props.onValid?.();
      }
    }).catch(console.error);
  }

  if (!hs) {
    return <span>Starting wasm...</span>
  }

  return (
    <div className={styles["container"]}>
      {isCorrect === true && (
        <span className={styles["correct"]}>
          <FaCheckCircle /> Correct
        </span>
      )}
      {isCorrect === false && (
        <span className={styles["error"]}>
          <BiSolidErrorAlt /> Incorrect
        </span>
      )}

      <button title="Validate proof" className="action-button" type="button" onClick={() => validate()}>
        <HiClipboardDocumentCheck />
        {!small && (
          <>
            Validate
            {autoValidate && (
              <MdHdrAuto />
            )}
          </>
        )}
      </button>
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