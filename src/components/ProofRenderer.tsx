import StepsContainer from "./StepsContainer";
import { ProofDispatchActionTypeEnum, useProof, useProofDispatch } from "../helpers/ProofContext";
import StepsRenderer from "./StepsRenderer";
import { makeSpecialCharacters } from "../helpers/proof-helper";

export default function ProofRenderer() {
  const proof = useProof();
  const proofDispatch = useProofDispatch();

  if (!proof || !proofDispatch) {
    return (
      <span>No proof :(</span>
    )
  }

  const insertLineAfterLast = () => {
    proofDispatch({
      type: ProofDispatchActionTypeEnum.InsertLineAfterLast,
    })
  }

  const insertBoxAfterLast = () => {
    proofDispatch({
      type: ProofDispatchActionTypeEnum.InsertBoxAfterLast,
    })
  }

  return (
    <StepsContainer>
      <span>{proof.premises.join(", ")} {makeSpecialCharacters("=>")} {proof.conclusion}</span>

      <StepsRenderer />

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="button" onClick={insertLineAfterLast}>+ New line</button>
        <button type="button" onClick={insertBoxAfterLast}>+ New box</button>
      </div>
    </StepsContainer>
  )
}