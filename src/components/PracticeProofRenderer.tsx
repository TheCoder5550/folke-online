import "./ProofRenderer.css";
import styles from "./ProofRenderer.module.css";
import StepsContainer from "./StepsContainer";
import StepsRenderer from "./StepsRenderer";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { makeSpecialCharacters } from "../helpers/special-characters";
import ValidateButton from "./ValidateButton";
import { LuListRestart } from "react-icons/lu";
import GlobalErrorMessage from "./GlobalErrorMessage";

export default function PracticeProofRenderer() {
  const dispatch = useProofStore((state) => state.dispatch);
  const sequent = useProofStore((state) => `${state.proof.premises.join("; ")} ${makeSpecialCharacters("=>")} ${state.proof.conclusion}`)

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

  const startOver = () => {
    if (confirm("Are you sure you want to start over? All progress will be deleted!")) {
      dispatch({
        type: ProofDispatchActionTypeEnum.Retry
      })
    }
  };

  return (
    <StepsContainer>
      <div className={styles["align"]}>
        <span>{sequent}</span>
      </div>

      <StepsRenderer />

      <div className={styles["align"]} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <GlobalErrorMessage />

        <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className={"action-button"} type="button" onClick={insertLineAfterLast}>+ New line</button>
            <button className={"action-button"} type="button" onClick={insertBoxAfterLast}>+ New box</button>
            <button className={"action-button"} type="button" onClick={startOver}>
              <LuListRestart /> Restart
            </button>
          </div>

          <ValidateButton />
        </div>
      </div>
    </StepsContainer>
  )
}