import { memo, type JSX } from "react";
import styles from "./ProofSingleRow.module.css"
import { isFlatLine, makeSpecialCharacters, RULE_META_DATA } from "../helpers/proof-helper";
import { TbBox, TbBoxOff, TbRowInsertBottom, TbRowInsertTop } from "react-icons/tb";
import { FaDeleteLeft } from "react-icons/fa6";
import { PiKeyReturnFill } from "react-icons/pi";
import AutocompleteInput, { type Suggestion } from "./AutocompleteInput";
import useProofStore, { ProofDispatchActionTypeEnum } from "../stores/proof-store";
import { useShallow } from "zustand/shallow";

interface ProofSingleRowProps {
  lineNumber: number;
  // path: StepPath;
  // path: string;
  uuid: string;
}

export const ProofSingleRowMemo = memo(ProofSingleRow);

export default function ProofSingleRow(props: ProofSingleRowProps) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const dispatch = useProofStore((state) => state.dispatch);
  const uuid = props.uuid;
  const step = useProofStore(useShallow((state) => state.proof.stepLookup[uuid]));

  if (!step || !isFlatLine(step)) {
    return <></>
  }

  const setStatement = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetStatement,
      uuid,
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
      // path: path,
      uuid,
      rule: makeSpecialCharacters(rule)
    })
  }
  const setArgument = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetArgument,
      // path: path,
      uuid,
      index: index,
      argument: makeSpecialCharacters(e.currentTarget.value)
    })
  }
  const remove = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.Remove,
      // path: path,
      uuid,
    })
  }
  const insertBefore = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertLineBefore,
      // path: path,
      uuid,
    })
  }
  const insertAfter = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertLineAfter,
      // path: path,
      uuid,
    })
  }
  const toBox = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.ToBox,
      // path: path,
      uuid,
    })
  }
  const toLine = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.ToLine,
      // path: path,
      uuid,
    })
  }
  const closeBox = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.CloseBoxWithLine,
      // path: path,
      uuid,
    })
  }

  const keydown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === "KeyB" && e.ctrlKey) {
      toBox();
    }
    else if (e.code === "KeyB" && e.ctrlKey && e.shiftKey) {
      toLine();
    }
    else if (e.code === "Enter" && e.ctrlKey) {
      closeBox();
    }
  }

  const keydownLastInput: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === "KeyB" && e.ctrlKey) {
      toBox();
    }
    else if (e.code === "KeyB" && e.ctrlKey && e.shiftKey) {
      toLine();
    }
    else if (e.code === "Enter" && e.ctrlKey) {
      closeBox();
    }
    else if (e.code === "Enter" && !e.ctrlKey) {
      insertAfter();
    }
  }

  const argumentInputs: JSX.Element[] = [];
  for (let i = 0; i < step.usedArguments; i++) {
    const arg = step.arguments[i] ?? "";
    const isLast = (i === step.usedArguments - 1);
    argumentInputs.push(
      <TextField
        placeholder={"Arg. " + (i + 1)}
        key={i.toString()}
        value={arg}
        onChange={e => setArgument(i, e)}
        onKeyDown={isLast ? keydownLastInput : keydown}
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
      <TextField placeholder="Empty statement" className={styles["statement-input"]} value={step.statement} onChange={setStatement} onKeyDown={keydown} />
      <div className={styles["rule-args-container"]}>
        <AutocompleteInput
          suggestions={suggestions}
          placeholder="Empty rule"
          containerClassName={styles["rule-name"]}
          value={step.rule}
          onChange={setRule}
          onSelectItem={selectRule}
          onKeyDown={step.usedArguments === 0 ? keydownLastInput : keydown}
        />
        {argumentInputs}
      </div>

      <div className={styles["actions"]}>
        <button type="button" title="Remove line" className={styles["action-button"]} onClick={remove}>
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

// export default function ProofSingleRow(props: ProofSingleRowProps) {
//   // eslint-disable-next-line @typescript-eslint/unbound-method
//   const dispatch = useProofStore((state) => state.dispatch);
//   // const path = useMemo(() => props.path.split(",").map(n => parseInt(n)), [ props.path ]);
//   // const step = useProofStore(useShallow((state) => getStepByPath(state.proof, path)));

//   const uuid = props.uuid;
//   const step = useProofStore(useShallow((state) => getStepByUUID(state.proof.steps, props.uuid)));

//   if (!step || !isStepLine(step)) {
//     return <></>
//   }

//   const setStatement = (e: React.ChangeEvent<HTMLInputElement>) => {
//     dispatch({
//       type: ProofDispatchActionTypeEnum.SetStatement,
//       // path: path,
//       uuid,
//       statement: makeSpecialCharacters(e.currentTarget.value)
//     })
//   }
//   const setRule = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setRuleFromString(e.currentTarget.value);
//   }
//   const selectRule = (item: Suggestion) => {
//     setRuleFromString(item.value);
//   }
//   const setRuleFromString = (rule: string) => {
//     dispatch({
//       type: ProofDispatchActionTypeEnum.SetRule,
//       // path: path,
//       uuid,
//       rule: makeSpecialCharacters(rule)
//     })
//   }
//   const setArgument = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     dispatch({
//       type: ProofDispatchActionTypeEnum.SetArgument,
//       // path: path,
//       uuid,
//       index: index,
//       argument: makeSpecialCharacters(e.currentTarget.value)
//     })
//   }
//   const remove = () => {
//     dispatch({
//       type: ProofDispatchActionTypeEnum.Remove,
//       // path: path,
//       uuid,
//     })
//   }
//   const insertBefore = () => {
//     dispatch({
//       type: ProofDispatchActionTypeEnum.InsertLineBefore,
//       // path: path,
//       uuid,
//     })
//   }
//   const insertAfter = () => {
//     dispatch({
//       type: ProofDispatchActionTypeEnum.InsertLineAfter,
//       // path: path,
//       uuid,
//     })
//   }
//   const toBox = () => {
//     dispatch({
//       type: ProofDispatchActionTypeEnum.ToBox,
//       // path: path,
//       uuid,
//     })
//   }
//   const toLine = () => {
//     dispatch({
//       type: ProofDispatchActionTypeEnum.ToLine,
//       // path: path,
//       uuid,
//     })
//   }
//   const closeBox = () => {
//     dispatch({
//       type: ProofDispatchActionTypeEnum.CloseBoxWithLine,
//       // path: path,
//       uuid,
//     })
//   }

//   const keydown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
//     if (e.code === "KeyB" && e.ctrlKey) {
//       toBox();
//     }
//     else if (e.code === "KeyB" && e.ctrlKey && e.shiftKey) {
//       toLine();
//     }
//     else if (e.code === "Enter" && e.ctrlKey) {
//       closeBox();
//     }
//   }

//   const keydownLastInput: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
//     if (e.code === "KeyB" && e.ctrlKey) {
//       toBox();
//     }
//     else if (e.code === "KeyB" && e.ctrlKey && e.shiftKey) {
//       toLine();
//     }
//     else if (e.code === "Enter" && e.ctrlKey) {
//       closeBox();
//     }
//     else if (e.code === "Enter" && !e.ctrlKey) {
//       insertAfter();
//     }
//   }

//   const argumentInputs: JSX.Element[] = [];
//   for (let i = 0; i < step.usedArguments; i++) {
//     const arg = step.arguments[i] ?? "";
//     const isLast = (i === step.usedArguments - 1);
//     argumentInputs.push(
//       <TextField
//         placeholder={"Arg. " + (i + 1)}
//         key={i.toString()}
//         value={arg}
//         onChange={e => setArgument(i, e)}
//         onKeyDown={isLast ? keydownLastInput : keydown}
//       />
//     )
//   }

//   const suggestions: Suggestion[] = [];
//   for (const [key] of Object.entries(RULE_META_DATA)) {
//     suggestions.push({
//       label: key,
//       value: key
//     });
//   }

//   return (
//     <div className={styles["proof-row"]}>
//       <span className={styles["number"]}>
//         {props.lineNumber}.
//       </span>
//       <TextField placeholder="Empty statement" className={styles["statement-input"]} value={step.statement} onChange={setStatement} onKeyDown={keydown} />
//       <div className={styles["rule-args-container"]}>
//         <AutocompleteInput
//           suggestions={suggestions}
//           placeholder="Empty rule"
//           containerClassName={styles["rule-name"]}
//           value={step.rule}
//           onChange={setRule}
//           onSelectItem={selectRule}
//           onKeyDown={step.usedArguments === 0 ? keydownLastInput : keydown}
//         />
//         {argumentInputs}
//       </div>

//       <div className={styles["actions"]}>
//         <button type="button" title="Remove line" className={styles["action-button"]} onClick={remove}>
//           <FaDeleteLeft />
//         </button>
//         <button type="button" title="Insert line above" className={styles["action-button"]} onClick={insertBefore}>
//           <TbRowInsertTop />
//         </button>
//         <button type="button" title="Insert line below" className={styles["action-button"]} onClick={insertAfter}>
//           <TbRowInsertBottom />
//         </button>
//         <button type="button" title="Convert line to box" className={styles["action-button"]} onClick={toBox}>
//           <TbBox />
//         </button>
//         <button type="button" title="Undo box" className={styles["action-button"]} onClick={toLine}>
//           <TbBoxOff />
//         </button>
//         <button type="button" title="Close box (Insert line below box)" className={styles["action-button"]} onClick={closeBox}>
//           <PiKeyReturnFill />
//         </button>
//       </div>
//     </div>
//   )
// }

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