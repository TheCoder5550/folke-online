import React from "react";
import styles from "./SymbolDictionary.module.css";

export default function SymbolDictionary() {
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

  return (
    <>
      <div className={styles["container"]}>
        {symbols.map(data => (
          <React.Fragment key={data.symbol}>
            <button className={styles["button"]} title={data.title} onClick={() => insertSymbol(data.symbol)} onMouseDown={e => e.preventDefault()} type="button">{data.symbol}</button>
            <div className={styles["divider"]}></div>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}