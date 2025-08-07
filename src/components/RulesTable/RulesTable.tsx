import React, { useState } from "react";
import styles from "./RulesTable.module.css";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import { FaInfoCircle } from "react-icons/fa";
import RuleModal from "../RuleModal";

export default function RulesTable() {
  const [rule, setRule] = useState<[string, RuleMetaData] | undefined>();

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

      <RuleModal rule={rule} closeModal={() => setRule(undefined)} />
    </div>
  )
}