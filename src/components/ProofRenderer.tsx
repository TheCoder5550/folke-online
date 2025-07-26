import "./ProofRenderer.css";
import styles from "./ProofRenderer.module.css";
import StepsContainer from "./StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";
import { PremiseFieldMemo } from "./PremiseField";
import { ConclusionFieldMemo } from "./ConclusionField";
import GlobalErrorMessage from "./GlobalErrorMessage";

export default function ProofRenderer() {
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

          <span className={styles["note"]}>Separated by ";"</span>
        </div>

        <h2>Proof</h2>
      </div>

      <StepsRenderer />

      <div className={styles["align"]} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <GlobalErrorMessage />

        <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className={"action-button"} type="button" onClick={insertLineAfterLast}>+ New line</button>
            <button className={"action-button"} type="button" onClick={insertBoxAfterLast}>+ New box</button>
          </div>
        </div>
      </div>
    </StepsContainer>
  )
}