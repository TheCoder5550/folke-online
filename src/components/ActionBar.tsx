import styles from "./ActionBar.module.css";
import { ImRedo, ImUndo } from "react-icons/im";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { useEffect, useRef } from "react";
import { flattenProof, haskellProofToProof } from "../helpers/proof-helper";
import { MdDelete } from "react-icons/md";
import ValidateButton from "./ValidateButton";
import { FaFileExport, FaUpload } from "react-icons/fa6";
import SymbolDictionary from "./SymbolDictionary";

export default function ActionBar() {
  const dispatch = useProofStore((state) => state.dispatch);
  const undo = useProofStore((state) => state.undo);
  const redo = useProofStore((state) => state.redo);
  const exportFolke = useProofStore((state) => state.exportFolke);
  const exportLatex = useProofStore((state) => state.exportLatex);

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

  const fileRef = useRef<HTMLInputElement>(null);

  const openUpload = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

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
        <ImUndo /> Undo
      </button>
      <button title={"Redo"} className={"action-button"} type="button" onClick={redo}>
        <ImRedo /> Redo
      </button>

      <button title={"Download as export.folke"} className={"action-button"} type="button" onClick={exportFolke}>
        <FaFileExport /> Export .folke
      </button>

      <button title={"Download as export.tex"} className={"action-button"} type="button" onClick={exportLatex}>
        <FaFileExport /> Export Latex
      </button>

      <input type="file" ref={fileRef} onChange={uploadProof} style={{ display: "none" }} />
      <button title="Upload proof" className={"action-button"} type="button" onClick={openUpload}>
        <FaUpload /> Upload .folke
      </button>

      <button title="Delete proof" className={"action-button"} type="button" onClick={resetProof}>
        <MdDelete /> Clear
      </button>

      <ValidateButton />

      <SymbolDictionary />
    </div>
  )
}