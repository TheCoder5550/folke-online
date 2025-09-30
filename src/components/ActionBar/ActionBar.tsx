import styles from "./ActionBar.module.css";
import { ImRedo, ImUndo } from "react-icons/im";
import useProofStore, { ProofDispatchActionTypeEnum } from "../../stores/proof-store";
import React, { useEffect, useRef, useState, type JSX } from "react";
import { flattenProof, haskellProofToProof } from "../../helpers/proof-helper";
import { MdDelete, MdOutlineMotionPhotosAuto } from "react-icons/md";
import ValidateButton from "../ValidateButton/ValidateButton";
import { FaBookOpen, FaFileExport, FaUpload } from "react-icons/fa6";
import SymbolDictionary from "../SymbolDictionary/SymbolDictionary";
import { cls } from "../../helpers/generic-helper";
import ToggleButton from "../ToggleButton/ToggleButton";
import RuleDictionary from "../RuleDictionary/RuleDictionary";
import { useScreenSize } from "../../helpers/use-screen-size";
import useWasm from "../../helpers/wasm-provider";
import { isKeybindPressed } from "../../helpers/keybinds";

const categories = [
  "File",
  "Edit",
  "Validation"
] as const;
type Categories = typeof categories[number];

export default function ActionBar() {
  const isMobile = useScreenSize() === "mobile";
  
  const [category, setCategory] = useState<Categories>("Edit");
  const [autoValidate, setAutoValidate] = useState(true);
  const [viewRules, setViewRules] = useState(!isMobile);

  const wasm = useWasm();
  const dispatch = useProofStore((state) => state.dispatch);
  const undo = useProofStore((state) => state.undo);
  const redo = useProofStore((state) => state.redo);
  const exportFolke = useProofStore((state) => state.exportFolke);
  const exportLatex = useProofStore((state) => state.exportLatex);

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

    e.target.value = "";
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
        <div className={styles["left"]}>
          {categories.map(c => (
            <button
              key={c}
              className={cls(styles["category-button"], category === c && styles["selected"])}
              type="button"
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className={styles["right"]}>
          {isMobile && (
            <ValidateButton small autoValidate={autoValidate} showButton={!autoValidate} />
          )}

          <ToggleButton toggle={() => setViewRules(!viewRules)} toggled={viewRules} title="Show rule dictionary" style={{ padding: "0.25em", height: "unset" }}>
            <FaBookOpen />
          </ToggleButton>
        </div>
      </div>

      <div className={styles["tab-content"]}>
        <div className={styles["current-actions"]}>
          {category === "File" && (
            <>
              <Button icon={<FaFileExport /> } label="Export .folke" title="Download as export.folke" onClick={exportFolke} small={isMobile} />
              <Button icon={<FaFileExport /> } label="Export Latex" title="Download as export.tex" onClick={exportLatex} small={isMobile} />

              <Divider />

              <input type="file" ref={fileRef} onChange={uploadProof} style={{ display: "none" }} />
              <Button icon={<FaUpload />} label="Upload .folke" title="Upload proof" onClick={openUpload} small={isMobile} />
              
              <Divider />

              <Button danger icon={<MdDelete />} label="Clear" title="Delete proof" onClick={resetProof} small={isMobile} />
            </>
          )}

          {category === "Edit" && (
            <>
              <Button icon={<ImUndo />} label="Undo" title={"Undo"} onClick={undo} small={isMobile} />
              <Button icon={<ImRedo />} label="Redo" title={"Redo"} onClick={redo} small={isMobile} />
              <Divider />
              <SymbolDictionary />
            </>
          )}

          {category === "Validation" && (
            <>
              {!wasm.error && (
                <ToggleButton label="Auto validate" toggle={() => setAutoValidate(!autoValidate)} toggled={autoValidate} title="Automatically validate proof whilst writing">
                  <MdOutlineMotionPhotosAuto />
                </ToggleButton>
              )}
            </>
          )}
        </div>
        
        {!isMobile && (
          <div className={styles["current-actions"]}>
            <ValidateButton autoValidate={autoValidate} showButton={!autoValidate} />
          </div>
        )}
      </div>

      <RuleDictionary visible={viewRules} setVisible={setViewRules} />
    </div>
  )
}

function Divider() {
  return (
    <div style={{
      display: "flex",
      height: "75%",
      margin: "0 0.5rem",
      borderLeft: "1px solid rgb(var(--text-rgb), 0.2)"
    }}></div>
  )
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon?: JSX.Element;
  small?: boolean;
  danger?: boolean;
}

function Button({ label, icon, small, danger, ...props }: ButtonProps) {
  return (
    <button
      className={cls("action-button", danger && "danger")}
      type="button"
      {...props}
    >
      {icon}
      {!small && label}
    </button>
  )
}