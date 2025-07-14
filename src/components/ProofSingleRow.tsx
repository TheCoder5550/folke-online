import { useContext } from "react";
import styles from "./ProofSingleRow.module.css"
import { ProofContext } from "../App";

interface ProofSingleRowProps {
  lineNumber: number;
  path: StepPath;
  step: StepLine;
}

export default function ProofSingleRow(props: ProofSingleRowProps) {
  const proofContext = useContext(ProofContext);

  const setStatement = (e: React.ChangeEvent<HTMLInputElement>) => proofContext.setStatement(props.path, e.currentTarget.value);
  const setRule = (e: React.ChangeEvent<HTMLInputElement>) => proofContext.setRule(props.path, e.currentTarget.value);
  const setArgument = (index: number, e: React.ChangeEvent<HTMLInputElement>) => proofContext.setArgument(props.path, index, e.currentTarget.value);

  return (
    <div className={styles["proof-row"]}>
      <span className={styles["number"]}>
        {props.lineNumber}.
      </span>
      <TextField className={styles["statement-input"]} value={props.step.statement} onChange={setStatement} />
      <div className={styles["rule-args-container"]}>
        <TextField className={styles["rule-name"]} value={props.step.rule} onChange={setRule} />
        {props.step.arguments.map((arg, index) => (
          <TextField key={props.path.join(",") + "-" + index} value={arg} onChange={e => setArgument(index, e)} />
        ))}
      </div>
    </div>
  )
}

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <input
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      type="text"
      {...props}
    />
  );
};