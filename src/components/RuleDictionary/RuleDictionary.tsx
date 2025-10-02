import styles from "./RuleDictionary.module.css";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import { useState } from "react";
import { cls } from "../../helpers/generic-helper";
import RuleModal from "../RuleModal";

interface RuleDictionaryProps {
  visible?: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RuleDictionary(props: RuleDictionaryProps) {
  const [rule, setRule] = useState<[string, RuleMetaData] | undefined>();

  if (props.visible === false) {
    return;
  }

  return (
    <div className={styles["container"]}>
      {/* <h2>Rules</h2> */}
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

      <button title="Hide rules" className={"close-button"} type="button" onClick={() => props.setVisible?.(false)}>
        ✕
      </button>

      <RuleModal rule={rule} closeModal={() => setRule(undefined)} />
    </div>
  )
}