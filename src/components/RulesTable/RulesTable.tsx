import React, { useState } from "react";
import styles from "./RulesTable.module.css";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import Modal from "../Modal/Modal";

export default function RulesTable() {
  const [rule, setRule] = useState<RuleMetaData | undefined>();
  const CurrentComp = rule == undefined ? undefined : rule.usageComponent;

  return (
    <div className={styles["table"]}>
      <h3>Name</h3>
      <h3>Rule</h3>
      <h3>Arguments</h3>
      <h3></h3>

      {Object.entries(RULE_META_DATA).map(([key, value]) => {
        if (!value) {
          return;
        }

        const nrArguments = value.nrArguments === 0 ? "-" : value.nrArguments.toString();
        const args = value.nrArguments === 0 ? nrArguments : value.argumentPlaceholders?.map((a, i) => `${i+1}: ${a}`).join(", ")

        return (
          <React.Fragment key={key}>
            <span>{value?.name}</span>
            <span style={{ fontFamily: "monospace" }}>{key}</span>
            <span>{args}</span>
            <div className={styles["usage-container"]}>
              <button className={styles["usage"]} type="button" onClick={() => setRule(value)}>Usage</button>
            </div>
          </React.Fragment>
        )
      })}

      <Modal open={rule != undefined} closeModal={() => setRule(undefined)}>
        {rule && (
          <>
            <h3>{rule.name}</h3>
            <p>{rule.description}</p>
          </>
        )}
        {CurrentComp && <CurrentComp />}
      </Modal>
    </div>
  )
}