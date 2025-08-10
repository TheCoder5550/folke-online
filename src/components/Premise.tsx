import { memo } from "react";
import rowStyles from "./ProofSingleRow/ProofSingleRow.module.css"
import { ManualLineNumber } from "./LineNumber/LineNumber";
import { useScreenSize } from "../helpers/use-screen-size";
import useProofStore from "../stores/proof-store";
import { cls } from "../helpers/generic-helper";

interface PremiseProps {
  premise: string;
  lineNumber: string;
}

export const PremiseMemo = memo(Premise);

export default function Premise(props: PremiseProps) {
  const isMobile = useScreenSize() === "mobile";
  const hasError = useProofStore((state) => state.result?.location == props.lineNumber);
  const errorMessage = useProofStore((state) => hasError ? state.result?.message : undefined);

  return (
    <div className={cls(rowStyles["proof-row"], hasError && rowStyles["error"])} style={{
      padding: "0.25rem",
      paddingLeft: isMobile ? undefined : "calc(0.25rem + 0.5rem + 1px)",
      marginRight: isMobile ? undefined : "2.75rem",
      fontFamily: "monospace",
      fontSize: isMobile ? "0.8rem" : "1rem"
    }}>
      <span className={rowStyles["number"]}>
        <ManualLineNumber lineNumber={props.lineNumber} hasError={hasError} />
      </span>
      <div className={rowStyles["statement-input"]}>
        <span>{props.premise}</span>
      </div>
      <div className={rowStyles["rule-args-container"]} style={{
        paddingLeft: isMobile ? "calc(0.25rem + 1px)" : "calc(0.5rem + 1px)"
      }}>
        <span>premise</span>
      </div>

      {hasError && errorMessage && (
        <span className={cls("error-message", rowStyles["error-message"])}>{errorMessage}</span>
      )}
    </div>
  )
}