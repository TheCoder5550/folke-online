import StepsContainer from "./StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";
import RunWasm from "./RunWasm";
import { TextFieldMemo } from "./TextField";
import { useEffect } from "react";
import { flattenProof, haskellProofToProof } from "../helpers/proof-helper";

export default function ProofRenderer() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const dispatch = useProofStore((state) => state.dispatch);
  // const premises = useProofStore((state) => state.proof.premises);
  const premiseInput = useProofStore((state) => state.premiseInput);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const setPremiseInput = useProofStore((state) => state.setPremiseInput);
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

  const resetProof = () => {
    if (confirm("Are you sure you want the reset the proof? Everything will be deleted!")) {
      dispatch({
        type: ProofDispatchActionTypeEnum.Reset
      })
    }
  };

  const uploadProof: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const file = files.item(0)
    file?.text().then(text => {
      const haskellProof = JSON.parse(text) as HaskellProof;
      const proof = haskellProofToProof(haskellProof);
      const flatProof = flattenProof(proof);

      dispatch({
        type: ProofDispatchActionTypeEnum.SetProof,
        proof: flatProof
      })
    }).catch(console.error);
  }

  useEffect(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetPremises,
      premises: premiseInput.split(",").map(p => makeSpecialCharacters(p.trim())).filter(p => p !== "")
    })
  }, [premiseInput])

  return (
    <StepsContainer>
      <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr auto 1fr" }}>
        <h2>Premises</h2>
        <span></span>
        <h2>Conclusion</h2>
        <TextFieldMemo value={premiseInput} onChange={e => setPremiseInput(makeSpecialCharacters(e.currentTarget.value))} />
        <span>{makeSpecialCharacters("=>")}</span>
        <TextFieldMemo value={conclusion} onChange={conclusionChange} />
      </div>

      <h2>Proof</h2>
      <StepsRenderer />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.25rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" onClick={insertLineAfterLast}>+ New line</button>
          <button type="button" onClick={insertBoxAfterLast}>+ New box</button>
        </div>

        <RunWasm />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" onClick={resetProof}>Reset proof</button>
          <input type="file" onChange={uploadProof} />
        </div>
      </div>

      <div style={{ height: "95vh" }} />
    </StepsContainer>
  )
}