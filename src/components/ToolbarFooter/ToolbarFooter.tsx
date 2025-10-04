import styles from "./ToolbarFooter.module.css";
import { useState } from "react";
import MenuBar from "../MenuBar/MenuBar";
import RuleModal from "../RuleModal";
import SymbolDictionary from "../SymbolDictionary/SymbolDictionary";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import { FaBook } from "react-icons/fa6";

export default function ToolbarFooter() {
  const [rule, setRule] = useState<[string, RuleMetaData] | undefined>();

  const menuBarData = [
    {
      icon: <FaBook />,
      label: "View Rules",
      children:
        Object.entries(RULE_META_DATA).map(([rule, data]) => {
          return {
            label: rule,
            action: () => data && setRule([rule, data])
          }
        })
    }
  ];
  
  return (
    <div className={styles["toolbar-container"]}>
      <div className={styles["toolbar"]}>
        <MenuBar data={menuBarData} above />
        <SymbolDictionary />
      </div>

      <RuleModal rule={rule} closeModal={() => setRule(undefined)} />
    </div>
  )
}