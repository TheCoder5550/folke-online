import { memo } from "react";
import { isFlatLine } from "../helpers/proof-helper";
import useProofStore from "../stores/proof-store";
import styles from "./ProofBox.module.css"
import { RenderStepMemo } from "./RenderStep";

interface ProofBoxProps {
  uuid: UUID;
}

export const ProofBoxMemo = memo(ProofBox);

export default function ProofBox(props: ProofBoxProps) {
  const uuids = useProofStore((state) => {
    const step = state.proof.stepLookup[props.uuid]
    if (!step || isFlatLine(step)) {
      return [];
    }

    return step.steps;
  });

  return (
    <div className={styles["proof-box"]}>
      {uuids.map(uuid => (
        <RenderStepMemo key={uuid} uuid={uuid} />
      ))}
    </div>
  )
}