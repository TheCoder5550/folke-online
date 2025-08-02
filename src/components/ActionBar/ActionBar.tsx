import styles from "./ActionBar.module.css";
import { ImRedo, ImUndo } from "react-icons/im";
import useProofStore, { ProofDispatchActionTypeEnum } from "../../stores/proof-store";
import { useEffect, useRef, useState } from "react";
import { flattenProof, haskellProofToProof } from "../../helpers/proof-helper";
import { MdDelete } from "react-icons/md";
import ValidateButton from "../ValidateButton/ValidateButton";
import { FaFileExport, FaUpload } from "react-icons/fa6";
import SymbolDictionary from "../SymbolDictionary/SymbolDictionary";
import { cls } from "../../helpers/generic-helper";

export default function ActionBar() {
  const [category, setCategory] = useState<"File" | "Edit">("Edit");
  const [autoValidate, setAutoValidate] = useState(true);

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
      <div className={styles["categories"]}>
        <button className={cls(styles["category-button"], category === "File" && styles["selected"])} type="button" onClick={() => setCategory("File")}>File</button>
        <button className={cls(styles["category-button"], category === "Edit" && styles["selected"])} type="button" onClick={() => setCategory("Edit")}>Edit</button>
      </div>

      <div className={styles["tab-content"]}>
        <div className={styles["current-actions"]}>
          {category === "File" && (
            <>
              <button title={"Download as export.folke"} className={"action-button"} type="button" onClick={exportFolke}>
                <FaFileExport /> Export .folke
              </button>

              <button title={"Download as export.tex"} className={"action-button"} type="button" onClick={exportLatex}>
                <FaFileExport /> Export Latex
              </button>

              <Divider />

              <input type="file" ref={fileRef} onChange={uploadProof} style={{ display: "none" }} />
              <button title="Upload proof" className={"action-button"} type="button" onClick={openUpload}>
                <FaUpload /> Upload .folke
              </button>
              
              <Divider />

              <button title="Delete proof" className={"action-button"} type="button" onClick={resetProof}>
                <MdDelete /> Clear
              </button>
            </>
          )}

          {category === "Edit" && (
            <>
              <button title={"Undo"} className={"action-button"} type="button" onClick={undo}>
                <ImUndo /> Undo
              </button>
              <button title={"Redo"} className={"action-button"} type="button" onClick={redo}>
                <ImRedo /> Redo
              </button>

              <Divider />

              <SymbolDictionary />
            </>
          )}
        </div>
        
        <div className={styles["current-actions"]}>
          <ValidateButton autoValidate={autoValidate} />
          <button title="Automatically validate proof whilst writing" type="button" className={"action-button"} onClick={() => setAutoValidate(!autoValidate)}>Auto validate: {autoValidate ? "On" : "Off"}</button>
        </div>
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div style={{
      display: "flex",
      height: "75%",
      margin: "0 0.5rem",
      borderLeft: "1px solid rgb(0, 0, 0, 0.2)"
    }}></div>
  )
}