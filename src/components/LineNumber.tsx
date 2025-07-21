import { memo } from "react";
import { getLineNumber } from "../helpers/proof-helper";
import useProofStore from "../stores/proof-store";

interface LineNumberProps {
  uuid: UUID;
}

export const LineNumberMemo = memo(LineNumber);

export default function LineNumber(props: LineNumberProps) {
  const lineNumber = useProofStore((state) => getLineNumber(state.proof, props.uuid));

  return (
    <span>{lineNumber}.</span>
  )
}