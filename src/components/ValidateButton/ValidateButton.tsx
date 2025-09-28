import styles from "./ValidateButton.module.css";
import { useCallback, useEffect, useState } from "react"
import useProofStore from "../../stores/proof-store.js";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidErrorAlt } from "react-icons/bi";
import useWasm from "../../helpers/wasm-provider.js";
import { ImSpinner4 } from "react-icons/im";

interface ValidateButtonProps {
  onValid?: () => void;
  autoValidate?: boolean;
  autoValidateMs?: number;
  small?: boolean;
  showButton?: boolean;
}

export default function ValidateButton(props: ValidateButtonProps) {
  const proof = useProofStore((state) => state.proof);
  const wasm = useWasm();
  const isCorrect = useProofStore((state) => state.result?.correct);
  const setResult = useProofStore((state) => state.setResult);
  const [isBuffering, setBuffering] = useState(false);

  const autoValidate = props.autoValidate !== false;
  const small = props.small === true;
  const showButton = props.showButton !== false;

  const validate = useCallback(() => {
    if (wasm.error) {
      setResult({
        correct: false,
        message: wasm.error,
        location: "Not supported"
      })
      return;
    }

    wasm.validate(proof).then(result => {
      setBuffering(false);
      setResult(result);
  
      if (result && result.correct) {
        props.onValid?.();
      }
    }).catch(console.error);
  }, [ wasm, proof ]);

  // De-bounce proof changes and check when no
  // key has been pressed for some time
  useEffect(() => {
    if (autoValidate) {
      setBuffering(true);
      const timeout = setTimeout(validate, props.autoValidateMs ?? 500);
      return () => {
        clearTimeout(timeout);
      }
    }
  }, [ proof, validate ]);

  // Instantly check proof on first render
  useEffect(() => {
    if (autoValidate) {
      validate();
    }
  }, [wasm]);

  if (wasm.error != null) {
    return undefined;
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

      {showButton && (
        <button title="Validate proof" className="action-button" type="button" onClick={() => validate()} disabled={!wasm}>
          {!isBuffering ? (
            <HiClipboardDocumentCheck />
          ) : (
            <ImSpinner4 className={styles["spin"]} />
          )}

          {!small && (
            <span>
              Validate
            </span>
          )}
        </button>
      )}
    </div>
  )
}