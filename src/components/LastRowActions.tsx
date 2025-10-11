import { useCallback } from "react";
import { IoReturnDownBack } from "react-icons/io5";
import { getNestedLevel, getUUIDOfLastRow } from "../helpers/proof-helper";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";

export default function LastRowActions() {
  const dispatch = useProofStore((state) => state.dispatch);
  const canCloseBox = useProofStore((state) => {
    const proof = state.getProof();
    const lastRow = getUUIDOfLastRow(proof);
    if (!lastRow) {
      return false;
    }

    return getNestedLevel(proof, lastRow) > 1;
  })

  const insertLineAfterLast = useCallback(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertLineAfterLast,
    })
  }, [ dispatch ]);

  const insertBoxAfterLast = useCallback(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertBoxAfterLast,
    })
  }, [ dispatch ]);

  const closeLastBox = useCallback(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.CloseLastBoxWithLine,
    })
  }, [ dispatch ]);

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button className={"action-button"} type="button" onClick={insertLineAfterLast}>+ New line</button>
      <button className={"action-button"} type="button" onClick={insertBoxAfterLast}>+ New box</button>
      {canCloseBox && (
        <button title={"Close the inner most box"} className={"action-button"} type="button" onClick={closeLastBox}>
          Close box
          <IoReturnDownBack />
        </button>
      )}
    </div>
  )
}