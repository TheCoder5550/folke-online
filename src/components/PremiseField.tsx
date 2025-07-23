import { memo, useEffect } from "react";
import { TextFieldMemo } from "./TextField";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";

export const PremiseFieldMemo = memo(PremiseField);

export default function PremiseField() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const dispatch = useProofStore((state) => state.dispatch);
  const premiseInput = useProofStore((state) => state.premiseInput);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const setPremiseInput = useProofStore((state) => state.setPremiseInput);

  useEffect(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetPremises,
      premises: premiseInput.split(",").map(p => makeSpecialCharacters(p.trim())).filter(p => p !== "")
    })
  }, [premiseInput])

  return (
    <TextFieldMemo value={premiseInput} onChange={e => setPremiseInput(makeSpecialCharacters(e.currentTarget.value))} />
  )
}