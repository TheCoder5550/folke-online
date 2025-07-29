import { memo } from "react";
import { getLineNumber } from "../../helpers/proof-helper";
import useProofStore from "../../stores/proof-store";
import { BiSolidErrorAlt } from "react-icons/bi";
import styles from "./LineNumber.module.css";

interface LineNumberProps {
  uuid: UUID;
}

export const LineNumberMemo = memo(LineNumber);

export default function LineNumber(props: LineNumberProps) {
  const lineNumber = useProofStore((state) => getLineNumber(state.proof, props.uuid));
  const hasError = useProofStore((state) => state.result?.location == lineNumber);

  if (hasError) {
    return <BiSolidErrorAlt className={styles["icon"]} />
  }

  return (
    <span>{lineNumber}.</span>
  )
}