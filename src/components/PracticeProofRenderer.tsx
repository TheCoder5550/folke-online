import "./ProofRenderer/ProofRenderer.css";
import styles from "./ProofRenderer/ProofRenderer.module.css";
import StepsContainer from "./StepsContainer/StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";
import ValidateButton from "./ValidateButton/ValidateButton";
import { LuListRestart } from "react-icons/lu";
import GlobalErrorMessage from "./GlobalErrorMessage";
import { useEffect, useState } from "react";
import { ImRedo, ImUndo } from "react-icons/im";
import StaticProofRenderer from "./StaticProofRenderer/StaticProofRenderer";
import { FaLightbulb } from "react-icons/fa6";
import Modal from "./Modal/Modal";
import { useScreenSize } from "../helpers/use-screen-size";
import { isKeybindPressed } from "../helpers/keybinds";

interface PracticeProofRendererProps {
  solution?: FlatProof;
  onValid?: () => void;
}

export default function PracticeProofRenderer(props: PracticeProofRendererProps) {
  const isMobile = useScreenSize() === "mobile";
  const [showSolution, setShowSolution] = useState(false);
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
      if (isKeybindPressed("undo", e)) {
        undo();
        e.preventDefault();
      }
      if (isKeybindPressed("redo", e)) {
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
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button title={"Insert a line below the last line"} className={"action-button"} type="button" onClick={insertLineAfterLast}>+ New line</button>
                <button title={"Insert a box below the last line"} className={"action-button"} type="button" onClick={insertBoxAfterLast}>+ New box</button>
              </div>
            </div>

            <GlobalErrorMessage />

            <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
              <button title={"Undo"} className={"action-button"} type="button" onClick={undo}>
                <ImUndo />
              </button>
              <button title={"Redo"} className={"action-button"} type="button" onClick={redo}>
                <ImRedo />
              </button>
              <button title={"Remove every"} className={"action-button"} type="button" onClick={startOver}>
                <LuListRestart /> Restart
              </button>
              <button title="Show solution" className={"action-button"} type="button" onClick={() => setShowSolution(true)}>
                <FaLightbulb /> Show solution
              </button>
            </div>

            <ValidateButton onValid={props.onValid} />
          </div>
        ) : (
          <>
            <GlobalErrorMessage />

            <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button title={"Insert a line below the last line"} className={"action-button"} type="button" onClick={insertLineAfterLast}>+ New line</button>
                <button title={"Insert a box below the last line"} className={"action-button"} type="button" onClick={insertBoxAfterLast}>+ New box</button>
                <button title={"Undo"} className={"action-button"} type="button" onClick={undo}>
                  <ImUndo />
                </button>
                <button title={"Redo"} className={"action-button"} type="button" onClick={redo}>
                  <ImRedo />
                </button>
                <button title={"Remove every"} className={"action-button"} type="button" onClick={startOver}>
                  <LuListRestart /> Restart
                </button>
                <button title="Show solution" className={"action-button"} type="button" onClick={() => setShowSolution(true)}>
                  <FaLightbulb /> Show solution
                </button>
              </div>

              <ValidateButton onValid={props.onValid} showButton={false} />
            </div>
          </>
        )}
      </div>


      <Modal open={showSolution} closeModal={() => setShowSolution(false)}>
        <h2>Solution</h2>

        {props.solution && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <span style={{ fontWeight: "bold" }}>{sequent}</span>
            <StaticProofRenderer proof={props.solution} />
          </div>
        )}

        {!props.solution && (
          <span>No solution provided. You're on your own :)</span>
        )}
      </Modal>
    </StepsContainer>
  )
}