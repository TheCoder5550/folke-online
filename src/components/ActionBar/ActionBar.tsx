import styles from "./ActionBar.module.css";
import { ImRedo, ImUndo } from "react-icons/im";
import useProofStore, { ProofDispatchActionTypeEnum } from "../../stores/proof-store";
import React, { useEffect, useRef, useState, type JSX } from "react";
import { flattenProof, haskellProofToProof } from "../../helpers/proof-helper";
import { MdDelete, MdOutlineMotionPhotosAuto } from "react-icons/md";
import ValidateButton from "../ValidateButton/ValidateButton";
import { FaDownload, FaFile, FaFileImport, FaFolder } from "react-icons/fa6";
import SymbolDictionary from "../SymbolDictionary/SymbolDictionary";
import { cls } from "../../helpers/generic-helper";
import ToggleButton from "../ToggleButton/ToggleButton";
import { useScreenSize } from "../../helpers/use-screen-size";
import useWasm from "../../helpers/wasm-provider";
import { isKeybindPressed } from "../../helpers/keybinds";
import MenuBar, { type MenuBarData } from "../MenuBar/MenuBar";

export default function ActionBar() {
  const isMobile = useScreenSize() === "mobile";
  
  const [autoValidate, setAutoValidate] = useState(true);

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

  const menuBarData: MenuBarData = [
    {
      label: "File",
      children: [
        {
          icon: <FaFile />,
          label: "New Proof",
          action: () => {},
        },
        {
          icon: <FaFolder />,
          label: "Open Proof",
          children: [
            
          ]
        },
        {
          icon: <FaFileImport />,
          label: "Import .folke",
          action: openUpload,
        },
        {
          icon: <FaDownload />,
          label: "Download",
          children: [
            {
              label: "Download .folke",
              action: exportFolke,
            },
            {
              label: "Download Latex",
              action: exportLatex,
            },
          ]
        },
        {
          icon: <MdDelete />,
          label: "Delete Proof",
          danger: true,
          action: resetProof,
        },
      ],
    },
    {
      label: "Edit",
      children: [
        {
          icon: <ImUndo />,
          label: "Undo",
          action: undo,
        },
        {
          icon: <ImRedo />,
          label: "Redo",
          action: redo,
        },
        {
          icon: <MdOutlineMotionPhotosAuto />,
          label: "Auto validate: " + (autoValidate ? "On" : "Off"),
          action: () => {
            setAutoValidate(v => !v)
            return false;
          },
        },
      ]
    }
  ]

  return (
    <div className={styles["action-bar"]}>
      <div className={styles["categories"]}>
        <div className={styles["left"]}>
          <MenuBar data={menuBarData} />
          <input type="file" ref={fileRef} onChange={uploadProof} style={{ display: "none" }} />
        </div>

        <div className={styles["right"]}>
          {isMobile && (
            <ValidateButton small autoValidate={autoValidate} showButton={!autoValidate} />
          )}

          {/* <ToggleButton toggle={() => setViewRules(!viewRules)} toggled={viewRules} title="Show rule dictionary" style={{ padding: "0.25em", height: "unset" }}>
            <FaBookOpen />
          </ToggleButton> */}
        </div>
      </div>

      <div className={styles["tab-content"]}>
        <div className={styles["current-actions"]}>
          <>
            <Button icon={<ImUndo />} label="Undo" title={"Undo"} onClick={undo} small />
            <Button icon={<ImRedo />} label="Redo" title={"Redo"} onClick={redo} small />
            <Divider />
            <SymbolDictionary />
          </>
          <>
            {!wasm.error && !isMobile && (
              <ToggleButton label="Auto validate" toggle={() => setAutoValidate(!autoValidate)} toggled={autoValidate} title="Automatically validate proof whilst writing">
                <MdOutlineMotionPhotosAuto />
              </ToggleButton>
            )}
          </>
        </div>
        
        {!isMobile && (
          <div className={styles["current-actions"]}>
            <ValidateButton autoValidate={autoValidate} showButton={!autoValidate} />
          </div>
        )}
      </div>

      {/* <RuleDictionary visible={viewRules} setVisible={setViewRules} /> */}
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