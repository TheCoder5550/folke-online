import styles from "./ToolbarFooter.module.css";
import { useState } from "react";
import MenuBar, { type MenuBarData } from "../MenuBar/MenuBar";
import RuleModal from "../RuleModal";
import SymbolDictionary from "../SymbolDictionary/SymbolDictionary";
import { RULE_META_DATA, type RuleMetaData } from "../../helpers/rules-data";
import { FaBook, FaBug } from "react-icons/fa6";
import ReportModal from "../ReportBug/ReportModal";

export default function ToolbarFooter() {
  const [rule, setRule] = useState<[string, RuleMetaData] | undefined>();
  const [showReport, setShowReport] = useState(false);

  const menuBarData: MenuBarData = [
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

  const reportBugMenu: MenuBarData = [
    {
      icon: <FaBug />,
      label: "Report bug",
      action: () => setShowReport(true),
    }
  ];
  
  return (
    <div className={styles["toolbar-container"]}>
      <div className={styles["toolbar"]}>
        <MenuBar data={menuBarData} above />
        <SymbolDictionary />

        <div className={styles["align-right"]}>
          <MenuBar data={reportBugMenu} above />
        </div>
      </div>

      <RuleModal rule={rule} closeModal={() => setRule(undefined)} />
      <ReportModal open={showReport} closeModal={() => setShowReport(false)} />
    </div>
  )
}