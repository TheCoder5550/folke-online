import styles from "./RuleDictionary.module.css";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import { useState } from "react";
import Modal from "../Modal";
import { cls } from "../../helpers/generic-helper";

export default function RuleDictionary() {
  const [hidden, setHidden] = useState(false);
  const [rule, setRule] = useState<RuleMetaData | undefined>();
  const CurrentComp = rule == undefined ? undefined : rule.usageComponent;

  return (
    <div className={styles["sticky-anchor"]}>
      {hidden ? (
        <button className={cls("action-button", styles["show"])} type="button" onClick={() => setHidden(false)}>Show rules</button>
      ) : (
        <div className={styles["container"]}>
          <h2>Rules</h2>
          <div className={styles["list"]}>
            {Object.entries(RULE_META_DATA).map(([rule, data]) => {
              return (
                <button type="button" key={rule} className={cls("action-button", styles["list-item"])} onClick={() => setRule(data)}>
                  {rule}
                </button>
              )
            })}
          </div>

          <button className={styles["hide"]} type="button" onClick={() => setHidden(true)}>✕</button>

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
      )}
    </div>
  )
}