import React from "react";
import { getSpecialCharacterAliases, SYMBOLS } from "../../helpers/special-characters";
import styles from "./SymbolTable.module.css";

export default function SymbolTable() {
  return (
    <div className={styles["table"]}>
      <h3>Name</h3>
      <h3>Symbol</h3>
      <h3>Shortcuts</h3>

      {SYMBOLS.map(symbol => (
        <React.Fragment key={symbol.title}>
          <span>{symbol.title}</span>
          <span>{symbol.symbol}</span>
          <div className={styles["shortcut-container"]}>
            {getSpecialCharacterAliases(symbol.symbol).map(shortcut => (
              <Shortcut key={shortcut}>
                {shortcut}
              </Shortcut>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

type ShortcutProps = React.PropsWithChildren;

function Shortcut({ children }: ShortcutProps) {
  return (
    <span className={styles["shortcut"]}>
      {children}
    </span>
  )
}