import { memo } from "react";
import { getLineNumber, isFlatLine } from "../helpers/proof-helper";
import useProofStore from "../stores/proof-store";
import styles from "./ProofBox.module.css"
import { RenderStepMemo } from "./RenderStep";

interface ProofBoxProps {
  uuid: UUID;
}

export const ProofBoxMemo = memo(ProofBox);

export default function ProofBox(props: ProofBoxProps) {
  const hasError = useProofStore((state) => state.result?.location == getLineNumber(state.proof, props.uuid));
  const errorMessage = useProofStore((state) => state.result?.message);

  const uuids = useProofStore((state) => {
    const step = state.proof.stepLookup[props.uuid]
    if (!step || isFlatLine(step)) {
      return [];
    }

    return step.steps;
  });

  return (
    <>
      <div className={[styles["proof-box"], hasError ? styles["error"] : undefined].join(" ")}>
        {uuids.map(uuid => (
          <RenderStepMemo key={uuid} uuid={uuid} />
        ))}
      </div>

      {hasError && errorMessage && (
        <span style={{ color: "red" }}>{errorMessage}</span>
      )}
    </>
  )
}