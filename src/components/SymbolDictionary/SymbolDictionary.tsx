import React, { useEffect, useState } from "react";
import styles from "./SymbolDictionary.module.css";
import { cls } from "../../helpers/generic-helper";

export default function SymbolDictionary() {
  const [enabled, setEnabled] = useState(true);

  const symbols = [
    { symbol: "¬", title: "Negation" },
    { symbol: "→", title: "Implication" },
    { symbol: "∧", title: "Conjunction" },
    { symbol: "∨", title: "Disjunction" },
    { symbol: "⊥", title: "Contradiction" },
    { symbol: "∀", title: "Universal quantifier" },
    { symbol: "∃", title: "Existential quantifier" },
  ];

  const insertSymbol = (symbol: string) => {
    if (!enabled) {
      return;
    }

    const selectedElement = document.activeElement;
    if (!selectedElement) {
      return;
    }
    if (!(selectedElement instanceof HTMLInputElement)) {
      return;
    }

    const startPos = selectedElement.selectionStart;
    const endPos = selectedElement.selectionEnd;
    if (startPos == null || endPos == null) {
      return;
    }

    const newValue = selectedElement.value.substring(0, startPos) + symbol + selectedElement.value.substring(endPos, selectedElement.value.length);

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.bind(selectedElement);
    if (!nativeInputValueSetter) {
      return;
    }

    nativeInputValueSetter.call(selectedElement, newValue);
    const event = new Event('input', { bubbles: true });
    selectedElement.dispatchEvent(event);
  }

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement) {
        setEnabled(true);
      }
    }

    const handleBlur = () => {
      setEnabled(false);
    }

    window.addEventListener("focus", handleFocus, true);
    window.addEventListener("blur", handleBlur, true);
    return () => {
      window.removeEventListener("focus", handleFocus, true);
      window.removeEventListener("blur", handleBlur, true);
    }
  })

  return (
    <>
      <div
        className={cls(styles["container"], !enabled && styles["disabled"])}
        title={enabled ? undefined : "Select a text field to enable"}
      >
        {symbols.map(data => (
          <React.Fragment key={data.symbol}>
            <button
              className={styles["button"]}
              title={enabled ? data.title : undefined}
              onClick={() => insertSymbol(data.symbol)}
              onMouseDown={e => e.preventDefault()}
              disabled={!enabled}
              type="button"
            >{data.symbol}</button>
            <div className={styles["divider"]}></div>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}