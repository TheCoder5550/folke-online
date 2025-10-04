import styles from "./ActionBar.module.css";
import { ImRedo, ImUndo } from "react-icons/im";
import useProofStore from "../../stores/proof-store";
import React, { useEffect, useRef, useState, type JSX } from "react";
import { createEmptyProof, flattenProof, getSequent, haskellProofToProof, isProofEmpty } from "../../helpers/proof-helper";
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
import { useShallow } from "zustand/shallow";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import RuleModal from "../RuleModal";

interface ActionBarProps {
  viewSidebar: boolean;
  setViewSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ActionBar(props: ActionBarProps) {
  const isMobile = useScreenSize() === "mobile";
  
  const [autoValidate, setAutoValidate] = useState(true);
  const [rule, setRule] = useState<[string, RuleMetaData] | undefined>();

  const wasm = useWasm();
  const undo = useProofStore((state) => state.undo);
  const redo = useProofStore((state) => state.redo);
  const exportFolke = useProofStore((state) => state.exportFolke);
  const exportLatex = useProofStore((state) => state.exportLatex);
  const activeIndex = useProofStore((state) => state.index);
  const addProof = useProofStore((state) => state.addProof);
  const removeProof = useProofStore((state) => state.removeProof);
  const setActiveProof = useProofStore((state) => state.setActiveProof);
  const latestIsEmpty = useProofStore((state) => isProofEmpty(state.proofs[state.proofs.length - 1]));
  const proofLabels = useProofStore(useShallow((state) => state.proofs.map(proof => isProofEmpty(proof) ? "New proof" : proof.name ?? getSequent(proof))));
  const proofButtons = proofLabels
    .map((label, index) => ({
      label,
      action: () => setActiveProof(index)
    }))
    .reverse();

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
    file
      ?.text()
      .then(text => {
        const haskellProof = JSON.parse(text) as HaskellProof;
        const proof = haskellProofToProof(haskellProof);
        const flatProof = flattenProof(proof);
        flatProof.name = file.name;
        addProof(flatProof);
      })
      .catch(console.error);

    e.target.value = "";
  }

  const removeActiveProof = () => {
    if (confirm("Are you sure you want the reset the proof? Everything will be deleted!")) {
      removeProof(activeIndex);
    }
  };

  const newProof = () => {
    if (latestIsEmpty) {
      setActiveProof(-1);
      return;
    }

    addProof(createEmptyProof());
  }

  const menuBarData: MenuBarData = [
    {
      label: "File",
      children: [
        {
          icon: <FaFile />,
          label: "New Proof",
          action: newProof,
        },
        {
          icon: <FaFolder />,
          label: "Open Recent Proofs",
          children: proofButtons
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
          action: removeActiveProof,
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
    },
    {
      label: "View",
      children: [
        {
          label: "Rule Guide",
          children:
            Object.entries(RULE_META_DATA).map(([rule, data]) => {
              return {
                label: rule,
                action: () => data && setRule([rule, data])
              }
            })
        },
        {
          label: props.viewSidebar ? "Hide Sidebar" : "Show Sidebar",
          action: () => props.setViewSidebar(s => !s)
        }
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

      <RuleModal rule={rule} closeModal={() => setRule(undefined)} />
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