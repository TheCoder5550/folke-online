import styles from "./KeybindsTable.module.css";
import { KEYBINDS, showKeybind } from "../../helpers/keybinds";
import React from "react";

const labels: Record<keyof typeof KEYBINDS, string> = {
  "undo": "Undo",
  "redo": "Redo",
  "proof-closeBox": "Close Box (Insert Line Below Box)",
  "proof-insertAfter": "Insert Line Below",
  "proof-insertBefore": "Insert Line Above",
  "proof-remove": "Remove Line",
  "proof-toBox": "Convert Line to Box",
  "proof-toLine": "Remove Box Around Line"
}

export default function KeybindsTable() {
  return (
    <div className={styles["table"]}>
      <h3>Action</h3>
      <h3>Shortcut</h3>

      {Object.entries(KEYBINDS).map(([label, _]) => (
        <React.Fragment key={label}>
          <span>{labels[label as keyof typeof KEYBINDS]}</span>
          <span>{showKeybind(label as keyof typeof KEYBINDS)}</span>
        </React.Fragment>
      ))}
    </div>
  )
}