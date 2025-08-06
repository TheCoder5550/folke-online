import React, { useState } from "react";
import styles from "./RulesTable.module.css";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import Modal from "../Modal/Modal";
import { FaInfoCircle } from "react-icons/fa";

export default function RulesTable() {
  const [rule, setRule] = useState<[string, RuleMetaData] | undefined>();
  const CurrentComp = rule == undefined ? undefined : rule[1].usageComponent;

  return (
    <div className={styles["table"]}>
      <h3>Identifier</h3>
      <h3>Name</h3>

      {Object.entries(RULE_META_DATA).map(([key, value]) => {
        if (!value) {
          return;
        }

        return (
          <React.Fragment key={key}>
            <span style={{ fontFamily: "monospace" }}>{key}</span>
            <div className={styles["usage-container"]}>
              <button title="View additional details" className={styles["usage"]} type="button" onClick={() => setRule([key, value])}>
                <FaInfoCircle opacity={0.75} />
                {value.name}
              </button>
            </div>
          </React.Fragment>
        )
      })}

      <Modal open={rule != undefined} closeModal={() => setRule(undefined)}>
        {rule && (
          <>
            <h2>{rule[1].name}</h2>
            <p>Symbol: <span style={{ fontFamily: "monospace" }}>{rule[0]}</span></p>
            <p>Arguments: {rule[1].nrArguments === 0 ? "-" : "(" + rule[1].argumentPlaceholders?.join(", ") + ")"}</p>
            <p>{rule[1].description}</p>
            <p>Usage:</p>
          </>
        )}
        {CurrentComp && <CurrentComp />}
      </Modal>
    </div>
  )
}