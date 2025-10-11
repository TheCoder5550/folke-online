import "./ProofRenderer.css";
import styles from "./ProofRenderer.module.css";
import StepsContainer from "../StepsContainer/StepsContainer";
import StepsRenderer from "../StepsRenderer";
import { makeSpecialCharacters } from "../../helpers/special-characters";
import { PremiseFieldMemo } from "../PremiseField";
import { ConclusionFieldMemo } from "../ConclusionField";
import { GlobalErrorMessageMemo } from "../GlobalErrorMessage";
import LastRowActions from "../LastRowActions";

export default function ProofRenderer() {
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
        <LastRowActions />
        <GlobalErrorMessageMemo />
      </div>
    </StepsContainer>
  )
}