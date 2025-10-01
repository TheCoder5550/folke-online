import { devtools, persist} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { closeBoxWith, convertToBox, convertToLine, createNewBox, createNewLine, flattenProof, getUUIDOfLastRow, getUUIDOfRowAbove, insertAfter, insertBefore, insertInto, moveAfter, proofToHaskellProof, removeFromProof, setArgument, setRule, setStatement, unflattenProof } from '../helpers/proof-helper';
import { createStore, useStore } from 'zustand';
import { createContext, use, useState } from 'react';
import { downloadText } from '../helpers/generic-helper';
import generateLatex from '../helpers/generate-latex';

const defaultProof = {
  premises: ["A", "B"],
  conclusion: "A ∧ B",
  steps: [
    // {
    //   statement: "A",
    //   rule: "premise",
    //   arguments: [],
    //   usedArguments: 0,
    // },
    // {
    //   statement: "B",
    //   rule: "premise",
    //   arguments: [],
    //   usedArguments: 0,
    // },
    {
      statement: "A ∧ B",
      rule: "∧I",
      arguments: ["1", "2"],
      usedArguments: 2,
    },
  ],
}
// const defaultProof = {
//   premises: ["A", "B"],
//   conclusion: "A ∧ B",
//   steps: [
//     {
//       statement: "A",
//       rule: "premise",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "B",
//       rule: "premise",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "A ∧ B",
//       rule: "∧I",
//       arguments: ["1", "2"],
//       usedArguments: 2,
//     },
//     {
//       steps: [
//         {
//           steps: [
//             {
//               statement: "A",
//               rule: "",
//               arguments: [],
//               usedArguments: 0,
//             },
//             {
//               statement: "B",
//               rule: "",
//               arguments: [],
//               usedArguments: 0,
//             },
//             {
//               statement: "C",
//               rule: "",
//               arguments: [],
//               usedArguments: 0,
//             },
//             {
//               steps: [
//                 {
//                   statement: "A",
//                   rule: "",
//                   arguments: [],
//                   usedArguments: 0,
//                 },
//                 {
//                   statement: "B",
//                   rule: "",
//                   arguments: [],
//                   usedArguments: 0,
//                 },
//                 {
//                   statement: "C",
//                   rule: "",
//                   arguments: [],
//                   usedArguments: 0,
//                 },
//                 {
//                   steps: [
//                     {
//                       statement: "A",
//                       rule: "",
//                       arguments: [],
//                       usedArguments: 0,
//                     },
//                     {
//                       statement: "B",
//                       rule: "",
//                       arguments: [],
//                       usedArguments: 0,
//                     },
//                     {
//                       statement: "C",
//                       rule: "",
//                       arguments: [],
//                       usedArguments: 0,
//                     },
//                   ]
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     },
//     {
//       statement: "Hello 1",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//     {
//       statement: "",
//       rule: "",
//       arguments: [],
//       usedArguments: 0,
//     },
//   ]
// };
const defaultFlatProof = flattenProof(defaultProof);

export const ProofDispatchActionTypeEnum = {
  SetProof: "SetProof",
  Reset: "Reset",
  Retry: "Retry",
  SetPremises: "SetPremises",
  SetConclusion: "SetConclusion",
  SetStatement: "SetStatement",
  SetRule: "SetRule",
  SetArgument: "SetArgument",
  Remove: "Remove",
  InsertLineBefore: "InsertLineBefore",
  InsertLineAfter: "InsertLineAfter",
  InsertBoxBefore: "InsertBoxBefore",
  InsertBoxAfter: "InsertBoxAfter",
  ToBox: "ToBox",
  ToLine: "ToLine",
  InsertLineAfterLast: "InsertLineAfterLast",
  InsertBoxAfterLast: "InsertBoxAfterLast",
  CloseBoxWithLine: "CloseBoxWithLine",
  CloseBoxWithBox: "CloseBoxWithBox",
  MoveAfter: "MoveAfter",
} as const;

export type ProofDispatchAction =
  | {
      type: typeof ProofDispatchActionTypeEnum.SetProof;
      proof: FlatProof;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.Reset;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.Retry;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.SetPremises;
      premises: string[];
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.SetConclusion;
      conclusion: string;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.SetStatement;
      uuid: UUID;
      statement: string;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.SetRule;
      uuid: UUID;
      rule: string;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.SetArgument;
      uuid: UUID;
      index: number;
      argument: string;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.Remove;
      uuid: UUID;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertLineBefore;
      uuid: UUID;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertLineAfter;
      uuid: UUID;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertBoxBefore;
      uuid: UUID;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertBoxAfter;
      uuid: UUID;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.ToBox;
      uuid: UUID;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.ToLine;
      uuid: UUID;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertLineAfterLast;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertBoxAfterLast;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.CloseBoxWithLine;
      uuid: UUID;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.CloseBoxWithBox;
      uuid: UUID;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.MoveAfter;
      moveThis: UUID;
      afterThis: UUID;
    }

type ProofStore = ReturnType<typeof createProofStore>;

type History =
  | {
      type: "ChangeStep";
      uuid: UUID;
      old: FlatStep;
      new: FlatStep;
    }
  | {
      type: "ChangeProof";
      old: FlatProof;
      new: FlatProof;
    }

interface ProofState {
  proof: FlatProof;
  premiseInput: string;
  result: CheckProofResult | null;

  history: History[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;

  exportFolke: () => void;
  exportLatex: () => void;

  dispatch: (action: ProofDispatchAction) => void;
  setPremiseInput: (input: string) => void;
  setResult: (result: CheckProofResult | null) => void;
}

const ProofStoreContext = createContext<ProofStore | null>(null)

const createProofStore = (initialProof: FlatProof, localStorageName: string) => (
  createStore<ProofState>()(
    devtools(
      immer(
        persist(
          (set, get) => ({
            proof: initialProof,
            premiseInput: initialProof.premises.join("; "),
            result: null,

            history: [],
            historyIndex: 0,

            undo() {
              set(state => {
                if (state.historyIndex <= 0) {
                  return;
                }

                state.historyIndex--;
                const prev = state.history[state.historyIndex];

                if (!prev) {
                  return;
                }

                if (prev.type === "ChangeProof") {
                  state.proof = prev.old;
                }
                else if (prev.type === "ChangeStep") {
                  state.proof.stepLookup[prev.uuid] = prev.old;
                }
              })
            },

            redo() {
              set(state => {
                if (state.historyIndex >= state.history.length) {
                  return;
                }

                const prev = state.history[state.historyIndex];
                state.historyIndex++;

                if (!prev) {
                  return;
                }

                if (prev.type === "ChangeProof") {
                  state.proof = prev.new;
                }
                else if (prev.type === "ChangeStep") {
                  state.proof.stepLookup[prev.uuid] = prev.new;
                }
              })
            },

            exportFolke() {
              const proof = get().proof;
              const unflat = unflattenProof(proof);
              const haskell = proofToHaskellProof(unflat);
              const text = JSON.stringify(haskell);
              downloadText(text, "export.folke");
            },
            
            exportLatex() {
              const proof = get().proof;
              const unflat = unflattenProof(proof);
              const latex = generateLatex(unflat);
              downloadText(latex, "export.tex");
            },

            dispatch(action: ProofDispatchAction) {
              set(state => {
                const old: FlatProof = {
                  premises: state.proof.premises.slice(),
                  conclusion: state.proof.conclusion,
                  steps: state.proof.steps.slice(),
                  stepLookup: JSON.parse(JSON.stringify(state.proof.stepLookup)) as StepLookup
                }

                reducer(state, action);

                const historyItem: History = {
                  type: "ChangeProof",
                  old: old,
                  new: {
                    premises: state.proof.premises.slice(),
                    conclusion: state.proof.conclusion,
                    steps: state.proof.steps.slice(),
                    stepLookup: JSON.parse(JSON.stringify(state.proof.stepLookup)) as StepLookup
                  }
                };
                state.history.splice(state.historyIndex, Infinity);
                state.history.push(historyItem);
                state.historyIndex++;
              })
            },
            setPremiseInput(input: string) {
              set(state => {
                state.premiseInput = input;
              })
            },
            setResult(result: CheckProofResult | null) {
              set(state => {
                state.result = result;
              })
            }
          }),
          {
            name: localStorageName,
            partialize: (state) => ({
              proof: state.proof,
              premiseInput: state.premiseInput
            })
          },
        )
      )
    )
  )
)

type ProofStoreProviderProps = React.PropsWithChildren & {
  localStorageName: string;
  initialProof?: FlatProof;
}

export const ProofStoreProvider = ({ children, initialProof, localStorageName }: ProofStoreProviderProps) => {
  initialProof = initialProof ?? defaultFlatProof;

  const [store] = useState(() => createProofStore(initialProof, localStorageName));

  return (
    <ProofStoreContext value={store}>
      {children}
    </ProofStoreContext>
  )
}

function useProofStore<T>(selector: (state: ProofState) => T) {
  const store = use(ProofStoreContext)
  if (!store) {
    throw new Error('Missing ProofStoreProvider')
  }
  const ups = useStore(store, selector)

  return ups;
}

export default useProofStore;

// const useProofStoreOld = create(devtools(immer(persist(
// 	combine({
// 		proof: defaultFlatProof,
//     premiseInput: defaultFlatProof.premises.join("; "),
//     result: null as (CheckProofResult | null)
// 	},
// 	(set, _get) => ({
//     dispatch(action: ProofDispatchAction) {
//       set(state => {
//         reducer(state, action);
//       })
//     },
//     setPremiseInput(input: string) {
//       set(state => {
//         state.premiseInput = input;
//       })
//     },
//     setResult(result: CheckProofResult | null) {
//       set(state => {
//         state.result = result;
//       })
//     }
// 	})),
//   {
//     name: 'current-proof-storage',
//     storage: createJSONStorage(() => sessionStorage),
//   },
// ))));

// export default useProofStore;

function reducer(draft: {
  proof: FlatProof;
  premiseInput: string;
}, action: ProofDispatchAction) {
  switch (action.type) {
    case ProofDispatchActionTypeEnum.SetProof: {
      draft.proof.premises = action.proof.premises;
      draft.proof.conclusion = action.proof.conclusion;
      draft.proof.steps = action.proof.steps;
      draft.proof.stepLookup = action.proof.stepLookup;
      draft.premiseInput = draft.proof.premises.join("; ");
      break;
    }
    case ProofDispatchActionTypeEnum.Reset: {
      draft.proof.premises = [];
      draft.proof.conclusion = "";
      draft.proof.steps = [];
      draft.proof.stepLookup = {};
      draft.premiseInput = "";
      break;
    }
    case ProofDispatchActionTypeEnum.Retry: {
      draft.proof.steps = [];
      draft.proof.stepLookup = {};
      break;
    }
    case ProofDispatchActionTypeEnum.SetPremises: {
      draft.proof.premises = action.premises;
      break;
    }
    case ProofDispatchActionTypeEnum.SetConclusion: {
      draft.proof.conclusion = action.conclusion;
      break;
    }
    case ProofDispatchActionTypeEnum.SetStatement: {
      setStatement(draft.proof, action.uuid, action.statement);
      break;
    }
    case ProofDispatchActionTypeEnum.SetRule: {
      setRule(draft.proof, action.uuid, action.rule);
      break;
    }
    case ProofDispatchActionTypeEnum.SetArgument: {
      setArgument(draft.proof, action.uuid, action.index, action.argument)
      break;
    }
    case ProofDispatchActionTypeEnum.Remove: {
      const prevRow = getUUIDOfRowAbove(draft.proof, action.uuid);
      removeFromProof(draft.proof, action.uuid)
      if (prevRow) {
        setFocus(prevRow);
      }
      break;
    }
    case ProofDispatchActionTypeEnum.InsertLineBefore: {
      const line = createNewLine();
      insertBefore(draft.proof, action.uuid, line);
      setFocus(line.uuid);
      break;
    }
    case ProofDispatchActionTypeEnum.InsertLineAfter: {
      const line = createNewLine();
      insertAfter(draft.proof, action.uuid, line)
      setFocus(line.uuid);
      break;
    }
    case ProofDispatchActionTypeEnum.InsertBoxBefore: {
      const box = createNewBox();
      insertBefore(draft.proof, action.uuid, box);
      const line = createNewLine();
      insertInto(draft.proof, box.uuid, line);
      setFocus(line.uuid);
      break;
    }
    case ProofDispatchActionTypeEnum.InsertBoxAfter: {
      const box = createNewBox();
      insertAfter(draft.proof, action.uuid, box);
      const line = createNewLine();
      insertInto(draft.proof, box.uuid, line);
      setFocus(line.uuid);
      break;
    }
    case ProofDispatchActionTypeEnum.ToBox: {
      convertToBox(draft.proof, action.uuid)
      setFocus(action.uuid);
      break;
    }
    case ProofDispatchActionTypeEnum.ToLine: {
      convertToLine(draft.proof, action.uuid)
      setFocus(action.uuid);
      break;
    }
    case ProofDispatchActionTypeEnum.InsertLineAfterLast: {
      const lastRow = getUUIDOfLastRow(draft.proof);
      if (!lastRow) {
        const line = createNewLine();
        draft.proof.stepLookup[line.uuid] = line;
        draft.proof.steps.push(line.uuid);
        setFocus(line.uuid);

        return;
      }

      reducer(draft, {
        type: ProofDispatchActionTypeEnum.InsertLineAfter,
        uuid: lastRow,
      });
      break;
    }
    case ProofDispatchActionTypeEnum.InsertBoxAfterLast: {
      const lastRow = getUUIDOfLastRow(draft.proof);
      if (!lastRow) {
        const box = createNewBox();
        draft.proof.stepLookup[box.uuid] = box;
        draft.proof.steps.push(box.uuid);

        const line = createNewLine();
        insertInto(draft.proof, box.uuid, line);
        setFocus(line.uuid);

        return;
      }

      reducer(draft, {
        type: ProofDispatchActionTypeEnum.InsertBoxAfter,
        uuid: lastRow,
      });
      break;
    }
    case ProofDispatchActionTypeEnum.CloseBoxWithLine: {
      const line = createNewLine();
      closeBoxWith(draft.proof, action.uuid, line);
      setFocus(line.uuid);
      break;
    }
    case ProofDispatchActionTypeEnum.CloseBoxWithBox: {
      const box = createNewBox();
      closeBoxWith(draft.proof, action.uuid, box);
      const line = createNewLine();
      insertInto(draft.proof, box.uuid, line);
      setFocus(line.uuid);
      break;
    }
    case ProofDispatchActionTypeEnum.MoveAfter: {
      moveAfter(draft.proof, action.moveThis, action.afterThis);
      break;
    }
  }
}

function setFocus(uuid: UUID) {
  requestAnimationFrame(() => {
    const step = document.querySelector(`*[data-uuid="${uuid}"]`);
    if (!step) {
      return;
    }
    const input = step.querySelector("input");
    input?.focus();
  });
}