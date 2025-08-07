import styles from "./ValidateButton.module.css";
import { useCallback, useEffect } from "react"
import useProofStore from "../../stores/proof-store.js";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidErrorAlt } from "react-icons/bi";
import { MdHdrAuto } from "react-icons/md";
import useWasm from "../../helpers/wasm-provider.js";

interface ValidateButtonProps {
  onValid?: () => void;
  autoValidate?: boolean;
  autoValidateMs?: number;
  small?: boolean;
}

export default function ValidateButton(props: ValidateButtonProps) {
  const proof = useProofStore((state) => state.proof);
  const wasm = useWasm();
  const isCorrect = useProofStore((state) => state.result?.correct);
  const setResult = useProofStore((state) => state.setResult);

  const autoValidate = props.autoValidate !== false;
  const small = props.small === true;

  const validate = useCallback(() => {
    if (!wasm) {
      console.error("WebAssembly not loaded yet");
      return;
    }

    wasm(proof).then(result => {
      setResult(result);
  
      if (result && result.correct) {
        props.onValid?.();
      }
    }).catch(console.error);
  }, [ wasm ]);

  useEffect(() => {
    setResult(null);

    if (autoValidate) {
      const timeout = setTimeout(validate, props.autoValidateMs ?? 500);
      return () => {
        clearTimeout(timeout);
      }
    }
  }, [proof, validate]);

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

      <button title="Validate proof" className="action-button" type="button" onClick={() => validate()} disabled={!wasm}>
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