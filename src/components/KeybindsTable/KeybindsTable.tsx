import styles from "./KeybindsTable.module.css";
import { KEYBINDS, showKeybindName, type KeybindId } from "../../helpers/keybinds";
import React from "react";

const labels: Record<KeybindId, string> = {
  "undo": "Undo",
  "redo": "Redo",

  "proof-closeBox": "Proof: Close box (Insert line below box)",
  "proof-insertAfter": "Proof: Insert line below",
  "proof-insertBefore": "Proof: Insert line above",
  "proof-remove": "Proof: Remove line",
  "proof-removeIfEmpty": "Proof: Remove empty line",
  "proof-toBox": "Proof: Convert line to box",
  "proof-toLine": "Proof: Remove box around line",
  "proof-nextField": "Proof: Go to next input field",

  "editor-newProof": "Editor: Create new proof",
  "editor-deleteProof": "Editor: Delete proof",
}

export default function KeybindsTable() {
  return (
    <div className={styles["table"]}>
      <h3>Action</h3>
      <h3>Shortcut</h3>

      {Object.entries(KEYBINDS).map(([label, _]) => (
        <React.Fragment key={label}>
          <span>{labels[label as KeybindId]}</span>
          <code>{showKeybindName(label as KeybindId)}</code>
        </React.Fragment>
      ))}
    </div>
  )
}