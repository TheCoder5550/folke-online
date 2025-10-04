import styles from "./KeybindsTable.module.css";
import { KEYBINDS, showKeybind } from "../../helpers/keybinds";
import React from "react";

const labels: Record<keyof typeof KEYBINDS, string> = {
  "undo": "Undo",
  "redo": "Redo",
  "proof-closeBox": "Close box (Insert line below box)",
  "proof-insertAfter": "Insert line below",
  "proof-insertBefore": "Insert line above",
  "proof-remove": "Remove line",
  "proof-removeIfEmpty": "Remove empty line",
  "proof-toBox": "Convert line to box",
  "proof-toLine": "Remove box around line",
  "proof-nextField": "Go to next input field",
}

export default function KeybindsTable() {
  return (
    <div className={styles["table"]}>
      <h3>Action</h3>
      <h3>Shortcut</h3>

      {Object.entries(KEYBINDS).map(([label, _]) => (
        <React.Fragment key={label}>
          <span>{labels[label as keyof typeof KEYBINDS]}</span>
          <code>{showKeybind(label as keyof typeof KEYBINDS)}</code>
        </React.Fragment>
      ))}
    </div>
  )
}