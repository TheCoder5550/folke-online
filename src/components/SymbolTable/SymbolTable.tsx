import React from "react";
import { getSpecialCharacterAliases, SYMBOLS } from "../../helpers/special-characters";
import styles from "./SymbolTable.module.css";
import { cls } from "../../helpers/generic-helper";
import Chip from "../Chip/Chip";

export default function SymbolTable() {
  return (
    <div className={styles["table"]}>
      <h3>Name</h3>
      <h3>Symbol</h3>
      <h3>Shortcuts</h3>
      <div className={cls(styles["row-divider"], styles["header"])}></div>

      {SYMBOLS.map(symbol => (
        <React.Fragment key={symbol.title}>
          <span>{symbol.title}</span>
          <span>{symbol.symbol}</span>
          <div className={styles["shortcut-container"]}>
            {getSpecialCharacterAliases(symbol.symbol).map(shortcut => (
              <Chip key={shortcut}>
                {shortcut}
              </Chip>
            ))}
          </div>

          <div className={styles["row-divider"]}></div>
        </React.Fragment>
      ))}
    </div>
  )
}