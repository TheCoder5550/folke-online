import React from "react";
import styles from "./RulesTable.module.css";
import { RULE_META_DATA } from "../../helpers/rules-data";

export default function RulesTable() {
  return (
    <div className={styles["table"]}>
      <h3>Name</h3>
      <h3>Rule</h3>
      <h3>Arguments</h3>

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
          </React.Fragment>
        )
      })}
    </div>
  )
}