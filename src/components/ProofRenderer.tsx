import "./ProofRenderer.css";
import styles from "./ProofRenderer.module.css";
import StepsContainer from "./StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";
import ValidateButton from "./ValidateButton";
import { flattenProof, haskellProofToProof, proofToHaskellProof, unflattenProof } from "../helpers/proof-helper";
import { PremiseFieldMemo } from "./PremiseField";
import { ConclusionFieldMemo } from "./ConclusionField";
import GlobalErrorMessage from "./GlobalErrorMessage";
import { MdDelete } from "react-icons/md";
import { ImRedo, ImUndo } from "react-icons/im";
import { useEffect } from "react";
import { downloadText } from "../helpers/generic-helper";
import generateLatex from "../helpers/generate-latex";

export default function ProofRenderer() {
  const dispatch = useProofStore((state) => state.dispatch);
  const proof = useProofStore((state) => state.proof);

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

  const resetProof = () => {
    if (confirm("Are you sure you want the reset the proof? Everything will be deleted!")) {
      dispatch({
        type: ProofDispatchActionTypeEnum.Reset
      })
    }
  };

  const uploadProof: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const file = files.item(0)
    file?.text().then(text => {
      const haskellProof = JSON.parse(text) as HaskellProof;
      const proof = haskellProofToProof(haskellProof);
      const flatProof = flattenProof(proof);

      dispatch({
        type: ProofDispatchActionTypeEnum.SetProof,
        proof: flatProof
      })
    }).catch(console.error);
  }

  const exportFolke = () => {
    const unflat = unflattenProof(proof);
    const haskell = proofToHaskellProof(unflat);
    const text = JSON.stringify(haskell);
    downloadText(text, "export.folke");
  };

  const exportLatex = () => {
    const unflat = unflattenProof(proof);
    const latex = generateLatex(unflat);
    console.log(latex);
    // downloadText(latex, "export.tex");
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
        <div className={styles["premise-conclusion-container"]}>
          <h2>Premises</h2>
          <span></span>
          <h2>Conclusion</h2>

          <PremiseFieldMemo />
          <span>{makeSpecialCharacters("=>")}</span>
          <ConclusionFieldMemo />

          <span className={styles["note"]}>Separated by ";"</span>
        </div>

        <h2>Proof</h2>
      </div>

      <StepsRenderer />

      <div className={styles["align"]} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <GlobalErrorMessage />

        <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className={"action-button"} type="button" onClick={insertLineAfterLast}>+ New line</button>
            <button className={"action-button"} type="button" onClick={insertBoxAfterLast}>+ New box</button>
            <button className={"action-button"} type="button" onClick={resetProof}>
              <MdDelete /> Clear
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

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input type="file" onChange={uploadProof} />

          <button title={"Download as export.folke"} className={"action-button"} type="button" onClick={exportFolke}>
            Export .folke
          </button>

          <button title={"Download as export.tex"} className={"action-button"} type="button" onClick={exportLatex}>
            Export Latex
          </button>
        </div>
      </div>
    </StepsContainer>
  )
}