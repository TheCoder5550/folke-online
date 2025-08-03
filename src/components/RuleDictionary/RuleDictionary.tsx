import styles from "./RuleDictionary.module.css";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import { useState } from "react";
import Modal from "../Modal";
import { cls } from "../../helpers/generic-helper";

interface RuleDictionaryProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RuleDictionary(props: RuleDictionaryProps) {
  const [rule, setRule] = useState<RuleMetaData | undefined>();
  const CurrentComp = rule == undefined ? undefined : rule.usageComponent;

  if (!props.visible) {
    return;
  }

  return (
    <div className={styles["container"]}>
      <h2>Rules</h2>
      <div className={styles["list"]}>
        {Object.entries(RULE_META_DATA).map(([rule, data]) => {
          return (
            <button title={data?.name} type="button" key={rule} className={cls("action-button", styles["list-item"])} onClick={() => setRule(data)}>
              {rule}
            </button>
          )
        })}
      </div>

      <button title="Hide rules" className={styles["hide"]} type="button" onClick={() => props.setVisible(false)}>✕</button>

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