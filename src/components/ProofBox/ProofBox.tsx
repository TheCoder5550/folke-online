import { memo, useRef } from "react";
import { getLineNumber, isFlatLine } from "../../helpers/proof-helper";
import useProofStore from "../../stores/proof-store";
import styles from "./ProofBox.module.css"
import { RenderStepMemo } from "../RenderStep";
import { useShallow } from "zustand/shallow";
import { MdDragIndicator } from "react-icons/md";
import { createDragHandler } from "../../helpers/drag-drop";

interface ProofBoxProps {
  uuid: UUID;
}

export const ProofBoxMemo = memo(ProofBox);

export default function ProofBox(props: ProofBoxProps) {
  const dispatch = useProofStore((state) => state.dispatch);
  const hasError = useProofStore((state) => state.result?.location == getLineNumber(state.proof, props.uuid));
  const errorMessage = useProofStore((state) => hasError ? state.result?.message : undefined);

  const uuids = useProofStore(useShallow((state) => {
    const step = state.proof.stepLookup[props.uuid]
    if (!step || isFlatLine(step)) {
      return [];
    }

    return step.steps;
  }));

  const lineRef = useRef<HTMLDivElement>(null);
  const startDrag = createDragHandler(lineRef, props.uuid, dispatch);

  return (
    <>
      <div data-target ref={lineRef} className={[styles["proof-box"], hasError ? styles["error"] : undefined].join(" ")}>
        <button data-uuid={props.uuid} onMouseDown={startDrag} type="button" title="Drag to re-arrange proof" className={styles["drag"]}>
          <MdDragIndicator />
        </button>

        <div className={styles["children-container"]}>
          {uuids.map(uuid => (
            <RenderStepMemo key={uuid} uuid={uuid} />
          ))}
        </div>
      </div>

      {hasError && errorMessage && (
        <span className={"error-message"}>{errorMessage}</span>
      )}
    </>
  )
}