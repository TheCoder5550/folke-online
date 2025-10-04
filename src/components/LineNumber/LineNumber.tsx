import { memo } from "react";
import { getLineNumber } from "../../helpers/proof-helper";
import useProofStore from "../../stores/proof-store";
import { BiSolidError } from "react-icons/bi";
import styles from "./LineNumber.module.css";
import { useScreenSize } from "../../helpers/use-screen-size";

interface LineNumberProps {
  uuid: UUID;
}

export const LineNumberMemo = memo(LineNumber);

export default function LineNumber(props: LineNumberProps) {
  const lineNumber = useProofStore((state) => getLineNumber(state.getProof(), props.uuid));
  const hasError = useProofStore((state) => matchLineNumber(state.result?.location, lineNumber));

  return <ManualLineNumber hasError={hasError} lineNumber={lineNumber} />
}

interface ManualLineNumberProps {
  hasError: boolean;
  lineNumber: string;
}

export function ManualLineNumber(props: ManualLineNumberProps) {
  const isMobile = useScreenSize() === "mobile";

  if (props.hasError) {
    return <BiSolidError className={styles["icon"]} />
  }

  const text = isMobile ? props.lineNumber : `${props.lineNumber}.`;
  const fontSize = isMobile ? "0.85em" : undefined;

  return (
    <span style={{ fontSize }}>{text}</span>
  )
}

function matchLineNumber(location: string | number | undefined, lineNumber: string): boolean {
  if (location == undefined) {
    return false;
  }

  if (location == lineNumber) {
    return true;
  }

  const match = location.toString().match(/^(\d+)-(\d+)$/);
  if (match) {
    const l = parseInt(lineNumber);
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);

    if (isNaN(l) || isNaN(start) || isNaN(end) || start > end) {
      return false;
    }

    return (
      l >= start &&
      l <= end
    );
  }

  return false;
}