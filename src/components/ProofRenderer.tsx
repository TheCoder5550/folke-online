import StepsContainer from "./StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";
import Premise from "./Premise";
import RunWasm from "./RunWasm";
import { TextFieldMemo } from "./TextField";
import { useEffect, useState } from "react";

export default function ProofRenderer() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const dispatch = useProofStore((state) => state.dispatch);
  const premises = useProofStore((state) => state.proof.premises);
  const conclusion = useProofStore((state) => state.proof.conclusion);

  const insertLineAfterLast = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertLineAfterLast,
    })
  }

  const insertBoxAfterLast = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertBoxAfterLast,
    })
  }

  const conclusionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetConclusion,
      conclusion: makeSpecialCharacters(e.currentTarget.value)
    })
  }

  const [premiseInput, setPremisInput] = useState(premises.join(", "));

  useEffect(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetPremises,
      premises: premiseInput.split(",").map(p => makeSpecialCharacters(p.trim()))
    })
  }, [premiseInput])

  return (
    <StepsContainer>
      <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr auto 1fr" }}>
        <h2>Premises</h2>
        <span></span>
        <h2>Conclusion</h2>
        <TextFieldMemo value={premiseInput} onChange={e => setPremisInput(makeSpecialCharacters(e.currentTarget.value))} style={{ flexGrow: "1" }} />
        <span>{makeSpecialCharacters("=>")}</span>
        <TextFieldMemo value={conclusion} onChange={conclusionChange} style={{ flexGrow: "1" }} />
      </div>

      <h2>Proof</h2>
      {premises.map((premise, index) => (
        <Premise key={index} premise={premise} lineNumber={(index + 1).toString()} />
      ))}
      <StepsRenderer />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.25rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" onClick={insertLineAfterLast}>+ New line</button>
          <button type="button" onClick={insertBoxAfterLast}>+ New box</button>
        </div>

        <RunWasm />
      </div>

      <div style={{ height: "95vh" }} />
    </StepsContainer>
  )
}