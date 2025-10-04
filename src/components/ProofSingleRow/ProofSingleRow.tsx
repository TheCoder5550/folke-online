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
import useContextMenuStore from "../../stores/context-menu-store";
import { useScreenSize } from "../../helpers/use-screen-size";
import { isKeybindPressed, showKeybind } from "../../helpers/keybinds";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";

interface ProofSingleRowProps {
  uuid: string;
}

export const ProofSingleRowMemo = memo(ProofSingleRow);

export default function ProofSingleRow(props: ProofSingleRowProps) {
  const isMobile = useScreenSize() === "mobile";
  const dispatch = useProofStore((state) => state.dispatch);
  const uuid = props.uuid;
  const step = useProofStore(useShallow((state) => state.getProof().stepLookup[uuid]));
  const level = useProofStore((state) => getNestedLevel(state.getProof(), uuid));
  const toLineEnabled = useProofStore((state) => canConvertToLine(state.getProof(), uuid));
  const closeBoxEnabled = useProofStore((state) => canCloseBox(state.getProof(), uuid));
  const hasError = useProofStore((state) => state.result?.location == getLineNumber(state.getProof(), props.uuid));
  const errorMessage = useProofStore((state) => hasError ? state.result?.message : undefined);
  const isCorrect = useProofStore((state) => state.result?.correct === true && state.result?.completed === true);

  const lineRef = useRef<HTMLDivElement>(null);
  const startDrag = createDragHandler(lineRef, props.uuid, dispatch);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const openContextMenu = useContextMenuStore((state) => state.open);

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

  const commonKeydown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    if (isKeybindPressed("proof-toBox", e)) {
      toBox();
    }
    else if (toLineEnabled && isKeybindPressed("proof-toLine", e)) {
      toLine();
    }
    else if (closeBoxEnabled && isKeybindPressed("proof-closeBox", e)) {
      closeBox();
    }
    else if (isKeybindPressed("proof-remove", e)) {
      remove();
    }
    else if (isKeybindPressed("proof-insertBefore", e)) {
      insertBefore();
    }
  }, [ toBox, toLine, closeBox, remove ]);

  const keydown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    commonKeydown(e);
  }, [ toBox, toLine, closeBox, remove ]);

  const keydownLastInput: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    commonKeydown(e);
    if (isKeybindPressed("proof-insertAfter", e)) {
      insertAfter();
    }
  }

  const openThisContextMenu = (e: React.MouseEvent) => {
    openContextMenu(e, [
      {
        label: "Remove Line",
        icon: <MdDelete />,
        shortcut: showKeybind("proof-remove"),
        action: remove,
        type: "danger",
      },
      {
        label: "Insert Line Above",
        icon: <TbRowInsertTop />,
        shortcut: showKeybind("proof-insertBefore"),
        action: insertBefore,
      },
      {
        label: "Insert Line Below",
        icon: <TbRowInsertBottom />,
        shortcut: showKeybind("proof-insertAfter"),
        action: insertAfter,
      },
      {
        label: "Close Box (Insert Line Below Box)",
        icon: <IoReturnDownBack />,
        shortcut: showKeybind("proof-closeBox"),
        action: closeBox,
        enabled: closeBoxEnabled,
      },
      {
        label: "Close Box with Box",
        icon: <IoReturnDownBack />,
        action: () => {
          dispatch({
            type: ProofDispatchActionTypeEnum.CloseBoxWithBox,
            uuid,
          })
        },
        enabled: closeBoxEnabled,
      },
      {
        label: "Convert Line to Box",
        icon: <TbBox />,
        shortcut: showKeybind("proof-toBox"),
        action: toBox,
      },
      {
        label: "Remove Box Around Line",
        icon: <TbBoxOff />,
        shortcut: showKeybind("proof-toLine"),
        action: toLine,
        enabled: toLineEnabled
      },
    ]);
  }

  const handleMouse: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== 2) {
      return;
    } 

    openThisContextMenu(e);

    e.preventDefault();
  }

  const argumentInputs: JSX.Element[] = [];
  for (let i = 0; i < step.usedArguments; i++) {
    let arg = step.arguments[i] ?? "";
    let prefix = "";
    const isLast = (i === step.usedArguments - 1);
    const ruleData = RULE_META_DATA[step.rule];
    const inputWidth = ruleData?.argumentInputLengths?.[i];
    const placeholder = ruleData?.argumentPlaceholders?.[i] ?? ("Arg " + (i + 1));

    if (step.rule === "=E" && i === 2) {
      arg = trimPrefix(arg, "u:=");
      prefix = "u:="
    }

    argumentInputs.push(
      <div key={i.toString()} className={styles["argument-container"]} style={inputWidth == undefined ? {} : { width: inputWidth + "px" }}>
        {ruleData && ruleData.argumentLabels && ruleData.argumentLabels[i] !== "" ? (
          <fieldset>
            <legend>{ruleData.argumentLabels[i]}</legend>
            <TextField
              placeholder={placeholder}
              value={arg}
              onChange={e => setArgument(i, prefix + e.currentTarget.value)}
              onKeyDown={isLast ? keydownLastInput : keydown}
            />
          </fieldset>
        ) : (
          <TextField
            placeholder={placeholder}
            value={arg}
            onChange={e => setArgument(i, prefix + e.currentTarget.value)}
            onKeyDown={isLast ? keydownLastInput : keydown}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <div
        onMouseDown={handleMouse}
        onContextMenu={e => e.preventDefault()}
        data-target data-uuid={props.uuid}
        ref={lineRef}
        className={cls(styles["proof-row"], hasError && styles["error"], isCorrect && styles["correct"])}
        style={{ marginRight: isMobile ? undefined : `calc(3rem - ${level * 0.25}rem - ${level}px)` }}
      >
        <span className={styles["number"]}>
          <LineNumberMemo uuid={props.uuid} />
        </span>
        <TextFieldMemo placeholder="Enter statement" className={styles["statement-input"]} value={step.statement} onChange={setStatement} onKeyDown={keydown} />
        <div className={styles["rule-args-container"]}>
          <AutocompleteInput
            suggestions={RULE_SUGGESTIONS}
            placeholder="Enter rule"
            containerClassName={styles["rule-name"]}
            value={step.rule}
            onChange={setRule}
            onSelectItem={selectRule}
            onKeyDown={step.usedArguments === 0 ? keydownLastInput : keydown}
          />
          {argumentInputs}
        </div>

        <button type="button" title="Open context menu" onClick={(e) => openThisContextMenu(e)} className={styles["context-dots"]}>
          <HiOutlineEllipsisVertical />
        </button>

        <div className={styles["actions"]}>
          <button type="button" title="Drag to re-arrange proof" className={cls(styles["action-button"], styles["drag"])} onMouseDown={startDrag}>
            <MdDragIndicator />
          </button>
          <button type="button" title={`Remove line (${showKeybind("proof-remove")})`} className={cls(styles["action-button"], styles["delete"])} onClick={remove}>
            <MdDelete />
          </button>
          <button type="button" title={`Insert line above (${showKeybind("proof-insertBefore")})`} className={styles["action-button"]} onClick={insertBefore}>
            <TbRowInsertTop />
          </button>
          <button type="button" title={`Insert line below (${showKeybind("proof-insertAfter")})`} className={styles["action-button"]} onClick={insertAfter}>
            <TbRowInsertBottom />
          </button>
          <button type="button" title={`Convert line to box (${showKeybind("proof-toBox")})`} className={styles["action-button"]} onClick={toBox}>
            <TbBox />
          </button>
          {toLineEnabled && (
            <button type="button" title={`Remove box around line (${showKeybind("proof-toLine")})`} className={styles["action-button"]} onClick={toLine}>
              <TbBoxOff />
            </button>
          )}
          {closeBoxEnabled && (
            <button type="button" title={`Close box (Insert line below box) (${showKeybind("proof-closeBox")})`} className={styles["action-button"]} onClick={closeBox}>
              <IoReturnDownBack />
            </button>
          )}
        </div>

        {hasError && errorMessage && (
          <span className={cls("error-message", styles["error-message"])}>{errorMessage}</span>
        )}
      </div>
    </>
  )
}

const RULE_SUGGESTIONS: Suggestion[] = [];
  for (const [key] of Object.entries(RULE_META_DATA)) {
    if (key === "premise") {
      continue;
    }

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