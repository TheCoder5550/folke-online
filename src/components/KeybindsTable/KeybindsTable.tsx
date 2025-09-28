import styles from "./KeybindsTable.module.css";
import { KEYBINDS, showKeybind } from "../../helpers/keybinds";
import React from "react";

export default function KeybindsTable() {
  return (
    <div className={styles["table"]}>
      <h3>Action</h3>
      <h3>Shortcut</h3>

      {Object.entries(KEYBINDS).map(([label, _]) => (
        <React.Fragment key={label}>
          <span>{label}</span>
          <span>{showKeybind(label as keyof typeof KEYBINDS)}</span>
        </React.Fragment>
      ))}
    </div>
  )
}