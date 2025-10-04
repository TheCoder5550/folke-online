import styles from "./ValidateButton.module.css";
import { useCallback, useEffect, useState } from "react"
import useProofStore from "../../stores/proof-store.js";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";
import useWasm from "../../helpers/wasm-provider.js";
import { ImSpinner4 } from "react-icons/im";
import { FaPlay } from "react-icons/fa6";
import { IoPlayOutline } from "react-icons/io5";

interface ValidateButtonProps {
  onValid?: () => void;
  autoValidate?: boolean;
  autoValidateMs?: number;
  small?: boolean;
  showButton?: boolean;
}

export default function ValidateButton(props: ValidateButtonProps) {
  const proof = useProofStore((state) => state.getProof());
  const wasm = useWasm();
  const isCorrect = useProofStore((state) => state.result?.correct);
  const isCompleted = useProofStore((state) => state.result?.completed);
  const setResult = useProofStore((state) => state.setResult);
  const [isBuffering, setBuffering] = useState(false);
  const [needRerun, setNeedRerun] = useState(true);

  const autoValidate = props.autoValidate !== false;
  const small = props.small === true;
  const showButton = props.showButton !== false;

  const validate = useCallback(() => {
    setBuffering(true);
    setNeedRerun(false);

    if (wasm.error) {
      setResult({
        completed: false,
        correct: false,
        message: wasm.error,
        location: "Not supported"
      })
      return;
    }

    wasm.validate(proof).then(result => {
      // Fake load time ;)
      setTimeout(() => {
        setBuffering(false);
      }, 100);
      setResult(result);
  
      if (result && result.correct && result.completed) {
        props.onValid?.();
      }
    }).catch(console.error);
  }, [ wasm, proof ]);

  // De-bounce proof changes and check when no
  // key has been pressed for some time
  useEffect(() => {
    setNeedRerun(true);

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
  }, [ wasm, autoValidate ]);

  if (wasm.error != null) {
    return undefined;
  }

  return (
    <div className={styles["container"]}>
      {isCorrect === true && isCompleted === true && (
        <span className={styles["correct"]}>
          Correct <FaCheckCircle />
        </span>
      )}
      {isCorrect === false && (
        <span className={styles["error"]}>
          Incorrect <BiSolidError />
        </span>
      )}

      {showButton && (
        <button
          title="Validate proof"
          className="action-button"
          type="button"
          onClick={() => validate()}
          disabled={!wasm}
          style={{
            padding: small ? "0.35em" : undefined,
            height: small ? "unset" : undefined,
          }}
        >
          {!isBuffering ? (
            <>
              {needRerun ? (
                <FaPlay />
              ) : (
                <IoPlayOutline />
              )}
            </>
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