import {combine, createJSONStorage, devtools, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import { closeBoxWith, convertToBox, convertToLine, createEmptyProof, createNewBox, createNewLine, flattenProof, getUUIDOfLastRow, insertAfter, insertBefore, insertInto, removeFromProof, setArgument, setRule, setStatement } from '../helpers/proof-helper';
import { create } from 'zustand';

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
  Reset: "Reset",
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
} as const;

type ProofDispatchAction =
  | {
      type: typeof ProofDispatchActionTypeEnum.Reset;
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

const useProofStore = create(devtools(immer(persist(
	combine({
		proof: defaultFlatProof,
	},
	(set, _get) => ({
    dispatch(action: ProofDispatchAction) {
      set(state => {
        reducer(state.proof, action);
      })
    }
	})),
  {
    name: 'current-proof-storage',
    storage: createJSONStorage(() => sessionStorage),
  },
))));

export default useProofStore;

function reducer(draft: FlatProof, action: ProofDispatchAction) {
  switch (action.type) {
    case ProofDispatchActionTypeEnum.Reset: {
      draft.premises = [];
      draft.conclusion = "";
      draft.steps = [];
      draft.stepLookup = {};
      break;
    }
    case ProofDispatchActionTypeEnum.SetPremises: {
      draft.premises = action.premises;
      break;
    }
    case ProofDispatchActionTypeEnum.SetConclusion: {
      draft.conclusion = action.conclusion;
      break;
    }
    case ProofDispatchActionTypeEnum.SetStatement: {
      setStatement(draft, action.uuid, action.statement);
      break;
    }
    case ProofDispatchActionTypeEnum.SetRule: {
      setRule(draft, action.uuid, action.rule);
      break;
    }
    case ProofDispatchActionTypeEnum.SetArgument: {
      setArgument(draft, action.uuid, action.index, action.argument)
      break;
    }
    case ProofDispatchActionTypeEnum.Remove: {
      removeFromProof(draft, action.uuid)
      break;
    }
    case ProofDispatchActionTypeEnum.InsertLineBefore: {
      insertBefore(draft, action.uuid, createNewLine())
      break;
    }
    case ProofDispatchActionTypeEnum.InsertLineAfter: {
      insertAfter(draft, action.uuid, createNewLine())
      break;
    }
    case ProofDispatchActionTypeEnum.InsertBoxBefore: {
      const box = createNewBox();
      insertBefore(draft, action.uuid, box);
      insertInto(draft, box.uuid, createNewLine());
      break;
    }
    case ProofDispatchActionTypeEnum.InsertBoxAfter: {
      const box = createNewBox();
      insertAfter(draft, action.uuid, box);
      insertInto(draft, box.uuid, createNewLine());
      break;
    }
    case ProofDispatchActionTypeEnum.ToBox: {
      convertToBox(draft, action.uuid)
      break;
    }
    case ProofDispatchActionTypeEnum.ToLine: {
      convertToLine(draft, action.uuid)
      break;
    }
    case ProofDispatchActionTypeEnum.InsertLineAfterLast: {
      const lastRow = getUUIDOfLastRow(draft);
      if (!lastRow) {
        const line = createNewLine();
        draft.stepLookup[line.uuid] = line;
        draft.steps.push(line.uuid);

        return;
      }

      reducer(draft, {
        type: ProofDispatchActionTypeEnum.InsertLineAfter,
        uuid: lastRow,
      });
      break;
    }
    case ProofDispatchActionTypeEnum.InsertBoxAfterLast: {
      const lastRow = getUUIDOfLastRow(draft);
      if (!lastRow) {
        const box = createNewBox();
        draft.stepLookup[box.uuid] = box;
        draft.steps.push(box.uuid);

        insertInto(draft, box.uuid, createNewLine());

        return;
      }

      reducer(draft, {
        type: ProofDispatchActionTypeEnum.InsertBoxAfter,
        uuid: lastRow,
      });
      break;
    }
    case ProofDispatchActionTypeEnum.CloseBoxWithLine: {
      closeBoxWith(draft, action.uuid, createNewLine());
      break;
    }
    case ProofDispatchActionTypeEnum.CloseBoxWithBox: {
      closeBoxWith(draft, action.uuid, createNewBox());
      break;
    }
  }
}