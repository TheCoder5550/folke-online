import { createContext, type JSX } from "react";
import { convertToBox, convertToLine, countRowsInStep, getPathToLastRow, insertAfter, insertBefore, isStepLine, makeSpecialCharacters, removeFromProof, setArgument, setRule, setStatement } from '../helpers/proof-helper'
import { useImmer } from 'use-immer'
import ProofSingleRow from "./ProofSingleRow";
import ProofBox from "./ProofBox";
import StepsContainer from "./StepsContainer";

interface ProofContextData {
  setStatement: (path: StepPath, statement: string) => void,
  setRule: (path: StepPath, rule: string) => void,
  setArgument: (path: StepPath, index: number, argument: string) => void,
  remove: (path: StepPath) => void,
  insertBefore: (path: StepPath) => void,
  insertAfter: (path: StepPath) => void,
  toBox: (path: StepPath) => void,
  toLine: (path: StepPath) => void,
}

export const ProofContext = createContext<ProofContextData>({
  setStatement: () => {},
  setRule: () => {},
  setArgument: () => {},
  remove: () => {},
  insertBefore: () => {},
  insertAfter: () => {},
  toBox: () => {},
  toLine: () => {},
});

export default function ProofRenderer() {
  const [proof, setProof] = useImmer(defaultProof);

  const _setStatement = (path: StepPath, statement: string) => {
    setProof(draft => {
      setStatement(draft, path, statement)
    });
  };

  const _setRule = (path: StepPath, rule: string) => {
    setProof(draft => {
      setRule(draft, path, rule)
    });
  };

  const _setArgument = (path: StepPath, index: number, argument: string) => {
    setProof(draft => {
      setArgument(draft, path, index, argument)
    });
  };

  const remove = (path: StepPath) => {
    setProof(draft => {
      removeFromProof(draft, path)
    });
  };

  const _insertBefore = (path: StepPath) => {
    setProof(draft => {
      insertBefore(draft, path, { statement: "", rule: "", arguments: [] })
    });
  };

  const _insertAfter = (path: StepPath) => {
    setProof(draft => {
      insertAfter(draft, path, { statement: "", rule: "", arguments: [] })
    });
  };

  const toBox = (path: StepPath) => {
    setProof(draft => {
      convertToBox(draft, path)
    });
  };

  const toLine = (path: StepPath) => {
    setProof(draft => {
      convertToLine(draft, path)
    });
  };

  const proofContextData: ProofContextData = {
    setStatement: _setStatement,
    setRule: _setRule,
    setArgument: _setArgument,
    remove,
    insertBefore: _insertBefore,
    insertAfter: _insertAfter,
    toBox,
    toLine
  };

  const insertAfterLast = () => _insertAfter(getPathToLastRow(proof));

  return (
    <ProofContext value={proofContextData}>
      <StepsContainer>
        <span>{proof.premises.join(", ")} {makeSpecialCharacters("=>")} {proof.conclusion}</span>

        {renderSteps(1, [], proof.steps)}

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" onClick={insertAfterLast}>+ New line</button>
          {/* <button type="button">+ New box</button> */}
        </div>
      </StepsContainer>
    </ProofContext>
  )
}

function renderSteps(lineNumber: number, path: StepPath, steps: Step[]) {
  const children: JSX.Element[] = [];

  for (let i = 0; i < steps.length; i++) {
    const nextPath = [...path, i];
    children.push(renderSingleStep(lineNumber, nextPath, steps[i]));
    lineNumber += countRowsInStep(steps[i]);
  }

  return children;
}

function renderSingleStep(lineNumber: number, path: StepPath, step: Step) {
  const key = path.join(",");

  if (isStepLine(step)) {
    return (
      <ProofSingleRow key={key} lineNumber={lineNumber} path={path} step={step} />
    )
  }
  else {
    return (
      <ProofBox key={key}>
        {renderSteps(lineNumber, path, step.steps)}
      </ProofBox>
    )
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
    },
    {
      statement: "B",
      rule: "premise",
      arguments: [],
    },
    {
      statement: "A ∧ B",
      rule: "∧I",
      arguments: ["1", "2"],
    },
  ]
};