import styles from "./ActionBar.module.css";
import { ImRedo, ImUndo } from "react-icons/im";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { useEffect } from "react";
import { flattenProof, haskellProofToProof, proofToHaskellProof, unflattenProof } from "../helpers/proof-helper";
import { downloadText } from "../helpers/generic-helper";
import generateLatex from "../helpers/generate-latex";
import { MdDelete } from "react-icons/md";
import ValidateButton from "./ValidateButton";

export default function ActionBar() {
  const dispatch = useProofStore((state) => state.dispatch);
  const proof = useProofStore((state) => state.proof);
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

  const resetProof = () => {
    if (confirm("Are you sure you want the reset the proof? Everything will be deleted!")) {
      dispatch({
        type: ProofDispatchActionTypeEnum.Reset
      })
    }
  };

  return (
    <div className={styles["action-bar"]}>
      <button title={"Undo"} className={"action-button"} type="button" onClick={undo}>
        <ImUndo />
      </button>
      <button title={"Redo"} className={"action-button"} type="button" onClick={redo}>
        <ImRedo />
      </button>

      <button title={"Download as export.folke"} className={"action-button"} type="button" onClick={exportFolke}>
        Export .folke
      </button>

      <button title={"Download as export.tex"} className={"action-button"} type="button" onClick={exportLatex}>
        Export Latex
      </button>

      <input type="file" onChange={uploadProof} />

      <button className={"action-button"} type="button" onClick={resetProof}>
        <MdDelete /> Clear
      </button>

      <ValidateButton />
    </div>
  )
}