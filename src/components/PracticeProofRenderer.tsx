import "./ProofRenderer/ProofRenderer.css";
import styles from "./ProofRenderer/ProofRenderer.module.css";
import StepsContainer from "./StepsContainer/StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import ValidateButton from "./ValidateButton/ValidateButton";
import { LuListRestart } from "react-icons/lu";
import GlobalErrorMessage from "./GlobalErrorMessage";
import { useCallback, useEffect, useState } from "react";
import { ImRedo, ImUndo } from "react-icons/im";
import StaticProofRenderer from "./StaticProofRenderer/StaticProofRenderer";
import { FaLightbulb } from "react-icons/fa6";
import Modal from "./Modal/Modal";
import { isKeybindPressed, showKeybindName } from "../helpers/keybinds";
import { cls, findParentElement } from "../helpers/generic-helper";
import { getSequent } from "../helpers/proof-helper";
import { useScreenSize } from "../helpers/use-screen-size";
import LastRowActions from "./LastRowActions";

interface PracticeProofRendererProps {
  solution?: FlatProof;
  onValid?: () => void;
}

export default function PracticeProofRenderer(props: PracticeProofRendererProps) {
  const isMobile = useScreenSize() === "mobile";

  const [showSolution, setShowSolution] = useState(false);
  const [thisProofHasFocus, setThisProofHasFocus] = useState(false);

  const undo = useProofStore((state) => state.undo);
  const redo = useProofStore((state) => state.redo);
  const dispatch = useProofStore((state) => state.dispatch);
  const sequent = useProofStore((state) => getSequent(state.getProof()));
  const stepLookup = useProofStore((state) => state.getProof().stepLookup);

  const maybeShowSolution = useCallback(() => {
    if (confirm("Are you sure you want to spoil the solution?")) {
      setShowSolution(true)
    }
  }, [ setShowSolution ]);

  const startOver = useCallback(() => {
    if (confirm("Are you sure you want to start over? All progress will be deleted!")) {
      dispatch({
        type: ProofDispatchActionTypeEnum.Retry
      })
    }
  }, [ dispatch ]);

  // Check if the last focused input belongs to this proof
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      if (!(e.target instanceof HTMLElement)) {
        return;
      }

      const row = findParentElement(e.target, (element) => element.hasAttribute("data-uuid"));
      if (!row) {
        return;
      }

      const uuid = row.getAttribute("data-uuid");
      if (uuid == null) {
        return;
      }

      setThisProofHasFocus(uuid in stepLookup);
    };

    window.addEventListener("focus", onFocus, true);
    return () => {
      window.removeEventListener("focus", onFocus, true);
    }
  }, [ stepLookup ]);

  // Undo/redo if this proof has focus
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (isKeybindPressed("undo", e)) {
        if (thisProofHasFocus) {
          undo();
        }
        e.preventDefault();
      }
      if (isKeybindPressed("redo", e)) {
        if (thisProofHasFocus) {
          redo();
        }
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("keydown", keydown);
    }
  }, [ undo, redo, stepLookup, thisProofHasFocus ]);

  return (
    <StepsContainer>
      <div className={cls(styles["sequent"], styles["align"])}>
        <span style={{ fontWeight: "bold" }}>{sequent}</span>
        <ValidateButton onValid={props.onValid} showButton={false} />
      </div>

      <StepsRenderer />

      <div className={styles["align"]} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "0.5rem", justifyContent: "space-between" }}>
          <LastRowActions />
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <button title={`Undo (${showKeybindName("undo")})`} className={"ghost-button"} type="button" onClick={undo}>
              <ImUndo />
            </button>
            <button title={`Redo (${showKeybindName("redo")})`} className={"ghost-button"} type="button" onClick={redo}>
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