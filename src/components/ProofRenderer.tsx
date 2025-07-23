import "./ProofRenderer.css";
import styles from "./ProofRenderer.module.css";
import StepsContainer from "./StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";
import RunWasm from "./RunWasm";
import { flattenProof, haskellProofToProof } from "../helpers/proof-helper";
import { PremiseFieldMemo } from "./PremiseField";
import { ConclusionFieldMemo } from "./ConclusionField";

export default function ProofRenderer() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const dispatch = useProofStore((state) => state.dispatch);

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

  return (
    <StepsContainer>
      <div className={styles["align"]}>
        <div className={styles["premise-conclusion-container"]}>
          <h2>Premises</h2>
          <span></span>
          <h2>Conclusion</h2>
          <PremiseFieldMemo />
          <span>{makeSpecialCharacters("=>")}</span>
          <ConclusionFieldMemo />
        </div>

        <h2>Proof</h2>
      </div>

      <StepsRenderer />

      <div className={styles["align"]} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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