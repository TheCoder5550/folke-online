import styles from "./PracticeRuleDictionary.module.css";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import { useState } from "react";
import { cls } from "../../helpers/generic-helper";
import RuleModal from "../RuleModal";

export default function PracticeRuleDictionary() {
  const [rule, setRule] = useState<[string, RuleMetaData] | undefined>();

  return (
    <>
      <div className={styles["list"]}>
        {Object.entries(RULE_META_DATA).map(([rule, data]) => {
          if (!data) {
            return <span key={rule}></span>
          }

          return (
            <button title={data?.name} type="button" key={rule} className={cls("action-button", styles["list-item"])} onClick={() => setRule([rule, data])}>
              {rule}
            </button>
          )
        })}
      </div>

      <RuleModal rule={rule} closeModal={() => setRule(undefined)} />
    </>
  )
}