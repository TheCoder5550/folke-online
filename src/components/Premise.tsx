import { memo } from "react";
import rowStyles from "./ProofSingleRow/ProofSingleRow.module.css"
import { ManualLineNumber } from "./LineNumber/LineNumber";
import { useScreenSize } from "../helpers/use-screen-size";

interface PremiseProps {
  premise: string;
  lineNumber: string;
}

export const PremiseMemo = memo(Premise);

export default function Premise(props: PremiseProps) {
  const isMobile = useScreenSize() === "mobile";

  return (
    <div className={rowStyles["proof-row"]} style={{
      padding: "0.25rem",
      paddingLeft: isMobile ? undefined : "calc(0.25rem + 0.5rem + 1px)",
      marginRight: isMobile ? undefined : "2.75rem",
      fontFamily: "monospace",
      fontSize: isMobile ? "0.8rem" : "1rem"
    }}>
      <span className={rowStyles["number"]}>
        <ManualLineNumber lineNumber={props.lineNumber} hasError={false} />
      </span>
      <div className={rowStyles["statement-input"]}>
        <span>{props.premise}</span>
      </div>
      <div className={rowStyles["rule-args-container"]} style={{
        paddingLeft: isMobile ? "calc(0.25rem + 1px)" : "calc(0.5rem + 1px)"
      }}>
        <span>premise</span>
      </div>
    </div>
  )
}