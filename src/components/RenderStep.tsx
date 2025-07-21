import { memo } from "react";
import useProofStore from "../stores/proof-store";
import { isFlatLine } from "../helpers/proof-helper";
import { ProofSingleRowMemo } from "./ProofSingleRow";
import { ProofBoxMemo } from "./ProofBox";

export const RenderStepMemo = memo(RenderStep);

export function RenderStep(props: { uuid: UUID }) {
  const isLine = useProofStore((state) => {
    const step = state.proof.stepLookup[props.uuid];
    return step && isFlatLine(step);
  });

  if (isLine) {
    return <ProofSingleRowMemo uuid={props.uuid} />
  }
  else {
    return <ProofBoxMemo uuid={props.uuid} />
  }
}