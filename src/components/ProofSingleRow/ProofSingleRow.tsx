import { memo, useCallback, useRef, type JSX } from "react";
import styles from "./ProofSingleRow.module.css"
import { canCloseBox, canConvertToLine, getLineNumber, getNestedLevel, isFlatLine } from "../../helpers/proof-helper";
import { TbBox, TbBoxOff, TbRowInsertBottom, TbRowInsertTop } from "react-icons/tb";
import AutocompleteInput, { type Suggestion } from "../AutocompleteInput/AutocompleteInput";
import useProofStore, { ProofDispatchActionTypeEnum } from "../../stores/proof-store";
import { useShallow } from "zustand/shallow";
import { getSpecialCharacterAliases, makeSpecialCharacters } from "../../helpers/special-characters";
import { RULE_META_DATA } from "../../helpers/rules-data";
import TextField, { TextFieldMemo } from "../TextField";
import { LineNumberMemo } from "../LineNumber/LineNumber";
import { MdDelete, MdDragIndicator } from "react-icons/md";
import { cls, trimPrefix } from "../../helpers/generic-helper";
import { IoReturnDownBack } from "react-icons/io5";
import { createDragHandler } from "../../helpers/drag-drop";

interface ProofSingleRowProps {
  uuid: string;
}

export const ProofSingleRowMemo = memo(ProofSingleRow);

export default function ProofSingleRow(props: ProofSingleRowProps) {
  const dispatch = useProofStore((state) => state.dispatch);
  const uuid = props.uuid;
  const step = useProofStore(useShallow((state) => state.proof.stepLookup[uuid]));
  const level = useProofStore((state) => getNestedLevel(state.proof, uuid));
  const toLineEnabled = useProofStore((state) => canConvertToLine(state.proof, uuid));
  const closeBoxEnabled = useProofStore((state) => canCloseBox(state.proof, uuid));
  const hasError = useProofStore((state) => state.result?.location == getLineNumber(state.proof, props.uuid));
  const errorMessage = useProofStore((state) => hasError ? state.result?.message : undefined);
  const isCorrect = useProofStore((state) => state.result?.correct ?? false);

  const lineRef = useRef<HTMLDivElement>(null);
  const startDrag = createDragHandler(lineRef, props.uuid, dispatch);

  if (!step || !isFlatLine(step)) {
    return <></>
  }

  const setStatement = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetStatement,
      uuid,
      statement: makeSpecialCharacters(e.currentTarget.value)
    })
  }, [ dispatch, uuid ]);
  const setRule = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRuleFromString(e.currentTarget.value);
  }
  const selectRule = (item: Suggestion) => {
    setRuleFromString(item.label);
  }
  const setRuleFromString = (rule: string) => {
    dispatch({
      type: ProofDispatchActionTypeEnum.SetRule,
      uuid,
      rule: makeSpecialCharacters(rule)
    })
  }
  const setArgument = (index: number, argument: string) => {
    argument = makeSpecialCharacters(argument);

    dispatch({
      type: ProofDispatchActionTypeEnum.SetArgument,
      uuid,
      index: index,
      argument: argument
    })
  }
  const remove = useCallback(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.Remove,
      uuid,
    })
  }, [ dispatch, uuid ]);
  const insertBefore = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertLineBefore,
      uuid,
    })
  }
  const insertAfter = () => {
    dispatch({
      type: ProofDispatchActionTypeEnum.InsertLineAfter,
      uuid,
    })
  }
  const toBox = useCallback(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.ToBox,
      uuid,
    })
  }, [ dispatch, uuid ]);
  const toLine = useCallback(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.ToLine,
      uuid,
    })
  }, [ dispatch, uuid ]);
  const closeBox = useCallback(() => {
    dispatch({
      type: ProofDispatchActionTypeEnum.CloseBoxWithLine,
      uuid,
    })
  }, [ dispatch, uuid ]);

  const keydown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    if (e.code === "KeyB" && e.ctrlKey) {
      toBox();
    }
    else if (toLineEnabled && e.code === "KeyB" && e.altKey) {
      toLine();
    }
    else if (e.code === "Enter" && e.ctrlKey) {
      closeBox();
    }
    else if (e.code === "Delete") {
      remove();
    }
  }, [ toBox, toLine, closeBox, remove ]);

  const keydownLastInput: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === "KeyB" && e.ctrlKey) {
      toBox();
    }
    else if (toLineEnabled && e.code === "KeyB" && e.altKey) {
      toLine();
    }
    else if (e.code === "Enter" && e.ctrlKey) {
      closeBox();
    }
    else if (e.code === "Enter" && !e.ctrlKey) {
      insertAfter();
    }
    else if (e.code === "Delete") {
      remove();
    }
  }

  const argumentInputs: JSX.Element[] = [];
  for (let i = 0; i < step.usedArguments; i++) {
    let arg = step.arguments[i] ?? "";
    let prefix = "";
    const isLast = (i === step.usedArguments - 1);
    const ruleData = RULE_META_DATA[step.rule];
    const inputWidth = ruleData?.argumentInputLengths?.[i];

    if (step.rule === "=E" && i === 2) {
      arg = trimPrefix(arg, "u:=");
      prefix = "u:="
    }

    argumentInputs.push(
      <div key={i.toString()} className={styles["argument-container"]} style={inputWidth == undefined ? {} : { width: inputWidth + "px" }}>
        {ruleData && ruleData.argumentLabels && ruleData.argumentLabels[i] !== "" && (
          <span>{ruleData.argumentLabels[i]}</span>
        )}

        <TextField
          placeholder={"Arg. " + (i + 1)}
          value={arg}
          onChange={e => setArgument(i, prefix + e.currentTarget.value)}
          onKeyDown={isLast ? keydownLastInput : keydown}
        />
      </div>
    )
  }

  return (
    <>
      <div data-target data-uuid={props.uuid} ref={lineRef} className={cls(styles["proof-row"], hasError && styles["error"], isCorrect && styles["correct"])} style={{ marginRight: `calc(3rem - ${level * 0.25}rem - ${level}px)` }}>
        <span className={styles["number"]}>
          <LineNumberMemo uuid={props.uuid} />
        </span>
        <TextFieldMemo focusOnAdd placeholder="Empty statement" className={styles["statement-input"]} value={step.statement} onChange={setStatement} onKeyDown={keydown} />
        <div className={styles["rule-args-container"]}>
          <AutocompleteInput
            suggestions={RULE_SUGGESTIONS}
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
          <button type="button" title="Drag to re-arrange proof" className={cls(styles["action-button"], styles["drag"])} onMouseDown={startDrag}>
            <MdDragIndicator />
          </button>
          <button type="button" title="Remove line" className={cls(styles["action-button"], styles["delete"])} onClick={remove}>
            <MdDelete />
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
          {toLineEnabled && (
            <button type="button" title="Undo box" className={styles["action-button"]} onClick={toLine}>
              <TbBoxOff />
            </button>
          )}
          {closeBoxEnabled && (
            <button type="button" title="Close box (Insert line below box)" className={styles["action-button"]} onClick={closeBox}>
              <IoReturnDownBack />
            </button>
          )}
        </div>
      </div>

      {hasError && errorMessage && (
        <span className={"error-message"}>{errorMessage}</span>
      )}
    </>
  )
}

const RULE_SUGGESTIONS: Suggestion[] = [];
  for (const [key] of Object.entries(RULE_META_DATA)) {
    const aliases = getPermutations(key);
    RULE_SUGGESTIONS.push({
      label: key,
      values: aliases
    });
  }

function getPermutations(rule: string): string[] {
  if (rule.length === 0) {
    return [""];
  }

  const char = rule.charAt(0);
  
  const aliases = getSpecialCharacterAliases(char);
  if (aliases.length === 0) {
    aliases.push(char);
  }
  
  const rest = rule.slice(1);
  const restPerms = getPermutations(rest);

  const allPerms = [];
  for (const alias of aliases) {
    for (const perm of restPerms) {
      allPerms.push(alias + perm);
    }
  }

  return allPerms;
}