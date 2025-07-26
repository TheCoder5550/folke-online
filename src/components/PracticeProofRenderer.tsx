import "./ProofRenderer.css";
import styles from "./ProofRenderer.module.css";
import StepsContainer from "./StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";
import ValidateButton from "./ValidateButton";
import { LuListRestart } from "react-icons/lu";
import GlobalErrorMessage from "./GlobalErrorMessage";
import { useEffect } from "react";
import { ImRedo, ImUndo } from "react-icons/im";

export default function PracticeProofRenderer() {
  const dispatch = useProofStore((state) => state.dispatch);
  const sequent = useProofStore((state) => `${state.proof.premises.join("; ")} ${makeSpecialCharacters("=>")} ${state.proof.conclusion}`)

  const insertLineAfterLast = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertLineAfterLast,
    })
  }

  const insertBoxAfterLast = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertBoxAfterLast,
    })
  }

  const startOver = () => {
    if (confirm("Are you sure you want to start over? All progress will be deleted!")) {
      dispatch({
        type: ProofDispatchActionTypeEnum.Retry
      })
    }
  };

  const undo = useProofStore((state) => state.undo);
  const redo = useProofStore((state) => state.redo);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.code === "KeyZ" && e.ctrlKey && !e.shiftKey) {
        undo();
        e.preventDefault();
      }
      if (e.code === "KeyZ" && e.ctrlKey && e.shiftKey) {
        redo();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("keydown", keydown);
    }
  }, [ undo, redo ]);

  return (
    <StepsContainer>
      <div className={styles["align"]}>
        <span style={{ fontWeight: "bold" }}>{sequent}</span>
      </div>

      <StepsRenderer />

      <div className={styles["align"]} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <GlobalErrorMessage />

        <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button title={"Insert a line below the last line"} className={"action-button"} type="button" onClick={insertLineAfterLast}>+ New line</button>
            <button title={"Insert a box below the last line"} className={"action-button"} type="button" onClick={insertBoxAfterLast}>+ New box</button>
            <button title={"Remove every"} className={"action-button"} type="button" onClick={startOver}>
              <LuListRestart /> Restart
            </button>
            <button title={"Undo"} className={"action-button"} type="button" onClick={undo}>
              <ImUndo />
            </button>
            <button title={"Redo"} className={"action-button"} type="button" onClick={redo}>
              <ImRedo />
            </button>
          </div>

          <ValidateButton />
        </div>
      </div>
    </StepsContainer>
  )
}