import "./ProofRenderer/ProofRenderer.css";
import styles from "./ProofRenderer/ProofRenderer.module.css";
import StepsContainer from "./StepsContainer/StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import ValidateButton from "./ValidateButton/ValidateButton";
import { LuListRestart } from "react-icons/lu";
import GlobalErrorMessage from "./GlobalErrorMessage";
import { useEffect, useState } from "react";
import { ImRedo, ImUndo } from "react-icons/im";
import StaticProofRenderer from "./StaticProofRenderer/StaticProofRenderer";
import { FaLightbulb } from "react-icons/fa6";
import Modal from "./Modal/Modal";
import { isKeybindPressed, showKeybind } from "../helpers/keybinds";
import { cls } from "../helpers/generic-helper";
import { getSequent } from "../helpers/proof-helper";

interface PracticeProofRendererProps {
  solution?: FlatProof;
  onValid?: () => void;
}

export default function PracticeProofRenderer(props: PracticeProofRendererProps) {
  const [showSolution, setShowSolution] = useState(false);
  const dispatch = useProofStore((state) => state.dispatch);
  const sequent = useProofStore((state) => getSequent(state.proof));

  const maybeShowSolution = () => {
    if (confirm("Are you sure you want to spoil the solution?")) {
      setShowSolution(true)
    }
  }

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
      <div className={cls(styles["sequent"], styles["align"])}>
        <span style={{ fontWeight: "bold" }}>{sequent}</span>
        <ValidateButton onValid={props.onValid} showButton={false} />
      </div>

      <StepsRenderer />

      <div className={styles["align"]} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button title={"Insert a line below the last line"} className={"action-button"} type="button" onClick={insertLineAfterLast}>+ New line</button>
            <button title={"Insert a box below the last line"} className={"action-button"} type="button" onClick={insertBoxAfterLast}>+ New box</button>
          </div>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <button title={`Undo (${showKeybind("undo")})`} className={"ghost-button"} type="button" onClick={undo}>
              <ImUndo />
            </button>
            <button title={`Redo (${showKeybind("redo")})`} className={"ghost-button"} type="button" onClick={redo}>
              <ImRedo />
            </button>
            <button title={"Remove everything"} className={"ghost-button"} type="button" onClick={startOver}>
              <LuListRestart />
            </button>
            <button title="Show solution" className={"ghost-button"} type="button" onClick={maybeShowSolution}>
              <FaLightbulb />
            </button>
          </div>
        </div>

        <GlobalErrorMessage />
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