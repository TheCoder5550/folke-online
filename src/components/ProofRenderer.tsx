import StepsContainer from "./StepsContainer";
import StepsRenderer from "./StepsRenderer";
import { makeSpecialCharacters } from "../helpers/proof-helper";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";

export default function ProofRenderer() {
  // const proof = useProof();
  // const proofDispatch = useProofDispatch();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const dispatch = useProofStore((state) => state.dispatch);
  const premises = useProofStore((state) => state.proof.premises.join(", "));
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

  return (
    <StepsContainer>
      <span>{premises} {makeSpecialCharacters("=>")} {conclusion}</span>

      <StepsRenderer />

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="button" onClick={insertLineAfterLast}>+ New line</button>
        <button type="button" onClick={insertBoxAfterLast}>+ New box</button>
      </div>

      <div style={{ height: "95vh" }} />
    </StepsContainer>
  )
}