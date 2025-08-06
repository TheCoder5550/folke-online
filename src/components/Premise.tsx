import { memo } from "react";
import rowStyles from "./ProofSingleRow/ProofSingleRow.module.css"

interface PremiseProps {
  premise: string;
  lineNumber: string;
}

export const PremiseMemo = memo(Premise);

export default function Premise(props: PremiseProps) {
  return (
    <div className={rowStyles["proof-row"]} style={{ padding: "0.25rem", paddingLeft: "calc(0.25rem + 0.5rem + 1px)", marginRight: "2.75rem", fontFamily: "monospace", fontSize: "1rem" }}>
      <span className={rowStyles["number"]}>
        <span>{props.lineNumber}.</span>
      </span>
      <div className={rowStyles["statement-input"]}>
        <span>{props.premise}</span>
      </div>
      <div className={rowStyles["rule-args-container"]} style={{ paddingLeft: "calc(0.5rem + 1px)" }}>
        <span>premise</span>
      </div>
    </div>
  )
}