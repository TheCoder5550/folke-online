import styles from "./ProofSingleRow.module.css"

interface ProofSingleRowProps {
  lineNumber: number;
  step: StepLine;
}

export default function ProofSingleRow(props: ProofSingleRowProps) {
  return (
    <div className={styles["proof-row"]}>
      <span className={styles["number"]}>
        {props.lineNumber}
      </span>
      <input className={styles["statement-input"]} value={props.step.statement}></input>
      <div className={styles["rule-args-container"]}>
        <input className={styles["rule-name"]} value={props.step.rule}></input>
        {props.step.arguments.map((arg, index) => (
          <input key={index + arg} value={arg}></input>
        ))}
      </div>
    </div>
  )
}