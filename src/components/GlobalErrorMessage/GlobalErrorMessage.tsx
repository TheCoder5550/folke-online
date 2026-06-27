import styles from "./GlobalErrorMessage.module.css";
import { memo, useState } from "react";
import useProofStore from "../../stores/proof-store"
import ReportModal from "../ReportModal/ReportModal";

export const GlobalErrorMessageMemo = memo(GlobalErrorMessage);

function GlobalErrorMessage() {
  const [showReport, setShowReport] = useState(false);
  
  const color = useProofStore((state) => {
    if (state.result?.message?.includes("Conclusion not reached")) {
      return "orange";
    }
    return "rgb(var(--error-color-rgb))";
  });

  const visible = useProofStore((state) => {
    return (
      state.getProof().steps.length !== 0 &&
      !state.result?.message?.includes("Conclusion not reached")
    )
  })

  const message = useProofStore((state) => {
    const res = state.result;
    if (!res || !res.location || !res.message || !visible) {
      return "";
    }

    if (res.location === "global") {
      return res.message ?? "";
    }

    return res.location + ": " + res.message;
  });

  const report = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    setShowReport(true);
  }

  const reportMessageVisible = useProofStore((state) => {
    return state.result?.completed || message
  })

  return (
    <div className={styles.container}>
      <span style={{ color }}>{message}&nbsp;</span>
      {reportMessageVisible && (
        <span className={styles.report}>Unexpected result? <a href="#" onClick={report}>Report bug</a></span>
      )}
      <ReportModal open={showReport} closeModal={() => setShowReport(false)} />
    </div>
  );
}