import { memo } from "react";
import { getLineNumber } from "../../helpers/proof-helper";
import useProofStore from "../../stores/proof-store";
import { BiSolidErrorAlt } from "react-icons/bi";
import styles from "./LineNumber.module.css";
import { useScreenSize } from "../../helpers/use-screen-size";

interface LineNumberProps {
  uuid: UUID;
}

export const LineNumberMemo = memo(LineNumber);

export default function LineNumber(props: LineNumberProps) {
  const lineNumber = useProofStore((state) => getLineNumber(state.proof, props.uuid));
  const hasError = useProofStore((state) => state.result?.location == lineNumber);

  return <ManualLineNumber hasError={hasError} lineNumber={lineNumber} />
}

interface ManualLineNumberProps {
  hasError: boolean;
  lineNumber: string;
}

export function ManualLineNumber(props: ManualLineNumberProps) {
  const isMobile = useScreenSize() === "mobile";

  if (props.hasError) {
    return <BiSolidErrorAlt className={styles["icon"]} />
  }

  const text = isMobile ? props.lineNumber : `${props.lineNumber}.`;
  const fontSize = isMobile ? "0.85em" : undefined;

  return (
    <span style={{ fontSize }}>{text}</span>
  )
}