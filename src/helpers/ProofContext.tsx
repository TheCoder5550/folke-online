import { createContext, use } from "react";
import { useImmerReducer } from "use-immer";
import { convertToBox, convertToLine, createNewBox, createNewLine, getParent, getPathToLastRow, insertAfter, insertBefore, removeFromProof, setArgument, setRule, setStatement } from "./proof-helper";

export const ProofDispatchActionTypeEnum = {
  SetStatement: "SetStatement",
  SetRule: "SetRule",
  SetArgument: "SetArgument",
  Remove: "Remove",
  InsertLineBefore: "InsertLineBefore",
  InsertLineAfter: "InsertLineAfter",
  InsertBoxBefore: "InsertLineBefore",
  InsertBoxAfter: "InsertLineAfter",
  ToBox: "ToBox",
  ToLine: "ToLine",
  InsertLineAfterLast: "InsertLineAfterLast",
  InsertBoxAfterLast: "InsertBoxAfterLast",
  CloseBoxWithLine: "CloseBoxWithLine",
  CloseBoxWithBox: "CloseBoxWithBox",
} as const;

type ProofDispatchAction =
  | {
      type: typeof ProofDispatchActionTypeEnum.SetStatement;
      path: StepPath;
      statement: string;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.SetRule;
      path: StepPath;
      rule: string;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.SetArgument;
      path: StepPath;
      index: number;
      argument: string;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.Remove;
      path: StepPath;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertLineBefore;
      path: StepPath;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertLineAfter;
      path: StepPath;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertBoxBefore;
      path: StepPath;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertBoxAfter;
      path: StepPath;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.ToBox;
      path: StepPath;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.ToLine;
      path: StepPath;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertLineAfterLast;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.InsertBoxAfterLast;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.CloseBoxWithLine;
      path: StepPath;
    }
  | {
      type: typeof ProofDispatchActionTypeEnum.CloseBoxWithBox;
      path: StepPath;
    }

const ProofDispatchContext = createContext<React.Dispatch<ProofDispatchAction> | null>(null);

const ProofContext = createContext<Proof | null>(null);

export function ProofProvider({ children }: React.PropsWithChildren) {
  const [proof, dispatch] = useImmerReducer(reducer, defaultProof);

  return (
    <ProofContext value={proof}>
      <ProofDispatchContext value={dispatch}>
        {children}
      </ProofDispatchContext>
    </ProofContext>
  )
}

export function useProofDispatch() {
  return use(ProofDispatchContext)
}

export function useProof() {
  return use(ProofContext)
}

function reducer(draft: Proof, action: ProofDispatchAction) {
  switch (action.type) {
    case ProofDispatchActionTypeEnum.SetStatement: {
      setStatement(draft, action.path, action.statement)
      break;
    }
    case ProofDispatchActionTypeEnum.SetRule: {
      setRule(draft, action.path, action.rule)
      break;
    }
    case ProofDispatchActionTypeEnum.SetArgument: {
      setArgument(draft, action.path, action.index, action.argument)
      break;
    }
    case ProofDispatchActionTypeEnum.Remove: {
      removeFromProof(draft, action.path)
      break;
    }
    case ProofDispatchActionTypeEnum.InsertLineBefore: {
      insertBefore(draft, action.path, createNewLine())
      break;
    }
    case ProofDispatchActionTypeEnum.InsertLineAfter: {
      insertAfter(draft, action.path, createNewLine())
      break;
    }
    case ProofDispatchActionTypeEnum.InsertBoxBefore: {
      insertBefore(draft, action.path, createNewBox())
      break;
    }
    case ProofDispatchActionTypeEnum.InsertBoxAfter: {
      insertAfter(draft, action.path, createNewBox())
      break;
    }
    case ProofDispatchActionTypeEnum.ToBox: {
      convertToBox(draft, action.path)
      break;
    }
    case ProofDispatchActionTypeEnum.ToLine: {
      convertToLine(draft, action.path)
      break;
    }
    case ProofDispatchActionTypeEnum.InsertLineAfterLast: {
      insertAfter(draft, getPathToLastRow(draft), createNewLine())
      break;
    }
    case ProofDispatchActionTypeEnum.InsertBoxAfterLast: {
      insertAfter(draft, getPathToLastRow(draft), createNewBox())
      break;
    }
    case ProofDispatchActionTypeEnum.CloseBoxWithLine: {
      insertAfter(draft, getParent(action.path), createNewLine());
      break;
    }
    case ProofDispatchActionTypeEnum.CloseBoxWithBox: {
      insertAfter(draft, getParent(action.path), createNewBox());
      break;
    }
  }
}

const defaultProof: Proof = {
  premises: ["A", "B"],
  conclusion: "A ∧ B",
  steps: [
    {
      statement: "A",
      rule: "premise",
      arguments: [],
      usedArguments: 0,
    },
    {
      statement: "B",
      rule: "premise",
      arguments: [],
      usedArguments: 0,
    },
    {
      statement: "A ∧ B",
      rule: "∧I",
      arguments: ["1", "2"],
      usedArguments: 2,
    },
  ]
};