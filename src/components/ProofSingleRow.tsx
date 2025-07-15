import { use } from "react";
import styles from "./ProofSingleRow.module.css"
import { ProofContext } from "./ProofRenderer";
import { makeSpecialCharacters } from "../helpers/proof-helper";
import { TbBox, TbBoxOff, TbRowInsertBottom, TbRowInsertTop } from "react-icons/tb";
import { FaDeleteLeft } from "react-icons/fa6";

interface ProofSingleRowProps {
  lineNumber: number;
  path: StepPath;
  step: StepLine;
}

export default function ProofSingleRow(props: ProofSingleRowProps) {
  const proofContext = use(ProofContext);

  const setStatement = (e: React.ChangeEvent<HTMLInputElement>) => proofContext.setStatement(props.path, makeSpecialCharacters(e.currentTarget.value));
  const setRule = (e: React.ChangeEvent<HTMLInputElement>) => proofContext.setRule(props.path, makeSpecialCharacters(e.currentTarget.value));
  const setArgument = (index: number, e: React.ChangeEvent<HTMLInputElement>) => proofContext.setArgument(props.path, index, makeSpecialCharacters(e.currentTarget.value));
  const remove = () => proofContext.remove(props.path);
  const insertBefore = () => proofContext.insertBefore(props.path);
  const insertAfter = () => proofContext.insertAfter(props.path);
  const toBox = () => proofContext.toBox(props.path);
  const toLine = () => proofContext.toLine(props.path);
  
  return (
    <div className={styles["proof-row"]}>
      <span className={styles["number"]}>
        {props.lineNumber}.
      </span>
      <TextField placeholder="Empty statement" className={styles["statement-input"]} value={props.step.statement} onChange={setStatement} />
      <div className={styles["rule-args-container"]}>
        <TextField placeholder="Empty rule" className={styles["rule-name"]} value={props.step.rule} onChange={setRule} />
        {props.step.arguments.map((arg, index) => (
          <TextField placeholder={"Arg. " + (index + 1)} key={props.path.join(",") + "-" + index} value={arg} onChange={e => setArgument(index, e)} />
        ))}
      </div>

      <div className={styles["actions"]}>
        <button type="button" className={styles["action-button"]} style={{ background: "red" }} onClick={remove}>
          <FaDeleteLeft />
        </button>
        <button type="button" className={styles["action-button"]} onClick={insertBefore}>
          <TbRowInsertTop />
        </button>
        <button type="button" className={styles["action-button"]} onClick={insertAfter}>
          <TbRowInsertBottom />
        </button>
        <button type="button" className={styles["action-button"]} onClick={toBox}>
          <TbBox />
        </button>
        <button type="button" className={styles["action-button"]} onClick={toLine}>
          <TbBoxOff />
        </button>
      </div>
    </div>
  )
}

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>

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