import { memo, useCallback } from "react";
import { TextFieldMemo } from "./TextField";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";

export const ConclusionFieldMemo = memo(ConclusionField);

export default function ConclusionField() {
  const dispatch = useProofStore((state) => state.dispatch);
  const conclusion = useProofStore((state) => state.proof.conclusion);

  const conclusionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetConclusion,
      conclusion: makeSpecialCharacters(e.currentTarget.value)
    })
  }, [ dispatch ]);

  return (
    <TextFieldMemo
      placeholder="Conclusion: A ∧ B"
      value={conclusion}
      onChange={conclusionChange}
    />
  )
}