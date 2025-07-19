import { type JSX } from "react";
import styles from "./ProofSingleRow.module.css"
import { makeSpecialCharacters, RULE_META_DATA } from "../helpers/proof-helper";
import { TbBox, TbBoxOff, TbRowInsertBottom, TbRowInsertTop } from "react-icons/tb";
import { FaDeleteLeft } from "react-icons/fa6";
import { ProofDispatchActionTypeEnum, useProofDispatch } from "../helpers/ProofContext";
import { PiKeyReturnFill } from "react-icons/pi";
import AutocompleteInput, { type Suggestion } from "./AutocompleteInput";

interface ProofSingleRowProps {
  lineNumber: number;
  path: StepPath;
  step: StepLine;
}

export default function ProofSingleRow(props: ProofSingleRowProps) {
  const dispatch = useProofDispatch();

  const setStatement = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetStatement,
      path: props.path,
      statement: makeSpecialCharacters(e.currentTarget.value)
    })
  }
  const setRule = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRuleFromString(e.currentTarget.value);
  }
  const selectRule = (item: Suggestion) => {
    setRuleFromString(item.value);
  }
  const setRuleFromString = (rule: string) => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetRule,
      path: props.path,
      rule: makeSpecialCharacters(rule)
    })
  }
  const setArgument = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetArgument,
      path: props.path,
      index: index,
      argument: makeSpecialCharacters(e.currentTarget.value)
    })
  }
  const remove = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.Remove,
      path: props.path,
    })
  }
  const insertBefore = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertLineBefore,
      path: props.path,
    })
  }
  const insertAfter = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertLineAfter,
      path: props.path,
    })
  }
  const toBox = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.ToBox,
      path: props.path,
    })
  }
  const toLine = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.ToLine,
      path: props.path,
    })
  }
  const closeBox = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.CloseBoxWithLine,
      path: props.path,
    })
  }

  const argumentInputs: JSX.Element[] = [];
  for (let i = 0; i < props.step.usedArguments; i++) {
    const index = i;
    const arg = props.step.arguments[index] ?? "";
    argumentInputs.push(
      <TextField
        placeholder={"Arg. " + (index + 1)}
        key={props.path.join(",") + "-" + index}
        value={arg}
        onChange={e => setArgument(index, e)}
      />
    )
  }

  const suggestions: Suggestion[] = [];
  for (const [key] of Object.entries(RULE_META_DATA)) {
    suggestions.push({
      label: key,
      value: key
    });
  }

  return (
    <div className={styles["proof-row"]}>
      <span className={styles["number"]}>
        {props.lineNumber}.
      </span>
      <TextField placeholder="Empty statement" className={styles["statement-input"]} value={props.step.statement} onChange={setStatement} />
      <div className={styles["rule-args-container"]}>
        <AutocompleteInput suggestions={suggestions} placeholder="Empty rule" containerClassName={styles["rule-name"]} value={props.step.rule} onChange={setRule} onSelectItem={selectRule} />
        {argumentInputs}
      </div>

      <div className={styles["actions"]}>
        <button type="button" title="Remove line" className={styles["action-button"]} style={{ background: "red" }} onClick={remove}>
          <FaDeleteLeft />
        </button>
        <button type="button" title="Insert line above" className={styles["action-button"]} onClick={insertBefore}>
          <TbRowInsertTop />
        </button>
        <button type="button" title="Insert line below" className={styles["action-button"]} onClick={insertAfter}>
          <TbRowInsertBottom />
        </button>
        <button type="button" title="Convert line to box" className={styles["action-button"]} onClick={toBox}>
          <TbBox />
        </button>
        <button type="button" title="Undo box" className={styles["action-button"]} onClick={toLine}>
          <TbBoxOff />
        </button>
        <button type="button" title="Close box (Insert line below box)" className={styles["action-button"]} onClick={closeBox}>
          <PiKeyReturnFill />
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