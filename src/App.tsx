import { createContext, useState, type JSX } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProofSingleRow from './components/ProofSingleRow'
import ProofBox from './components/ProofBox'
import ProofContainer from './components/ProofContainer'
import { countRowsInStep, isStepLine, setArgument, setRule, setStatement } from './helpers/proof-helper'
import { useImmer } from 'use-immer'

interface ProofContextData {
  setStatement: (path: StepPath, statement: string) => void,
  setRule: (path: StepPath, rule: string) => void,
  setArgument: (path: StepPath, index: number, argument: string) => void,
}

export const ProofContext = createContext<ProofContextData>({
  setStatement: () => {},
  setRule: () => {},
  setArgument: () => {},
});

function App() {
  const [count, setCount] = useState(0)

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

  const proofContextData = {
    setStatement: _setStatement,
    setRule: _setRule,
    setArgument: _setArgument
  };

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
    if (isStepLine(step)) {
      return (
        <ProofSingleRow lineNumber={lineNumber} path={path} step={step} />
      )
    }
    else {
      return (
        <ProofBox>
          {renderSteps(lineNumber, path, step.steps)}
        </ProofBox>
      )
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <ProofContext value={proofContextData}>
        {proof.premises.map((p, index) => (
          <span key={p}>{p}, </span>
        ))}

        <span>Conclusion: {proof.conclusion}</span>

        <ProofContainer>
          {renderSteps(1, [], proof.steps)}
        </ProofContainer>
      </ProofContext>
    </>
  )
}

const defaultProof: Proof = {
  premises: ["A", "B"],
  conclusion: "A & B",
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
      statement: "A & B",
      rule: "&I",
      arguments: ["1", "2"],
    },

    {
      steps: [
        {
          statement: "A & B",
          rule: "&I",
          arguments: ["1", "2"],
        },
        {
          statement: "A & B",
          rule: "&I",
          arguments: ["1", "2"],
        },
        {
          statement: "A & B",
          rule: "&I",
          arguments: ["1", "2"],
        },
        {
          statement: "A & B",
          rule: "&I",
          arguments: ["1", "2"],
        },
      ]
    },
    {
      steps: [
        {
          statement: "A & B",
          rule: "&I",
          arguments: ["1", "2"],
        },
        {
          statement: "A & B",
          rule: "&I",
          arguments: ["1", "2"],
        },
        {
          steps: [
            {
              statement: "A & B",
              rule: "&I",
              arguments: ["1", "2"],
            },
            {
              statement: "A & B",
              rule: "&I",
              arguments: ["1", "2"],
            },
            {
              statement: "A & B",
              rule: "&I",
              arguments: ["1", "2"],
            },
            {
              statement: "A & B",
              rule: "&I",
              arguments: ["1", "2"],
            },
          ]
        },
        {
          statement: "A & B",
          rule: "&I",
          arguments: ["1", "2"],
        },
        {
          statement: "A & B",
          rule: "&I",
          arguments: ["1", "2"],
        },
      ]
    }
  ]
};

export default App
