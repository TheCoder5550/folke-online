import { useState, type JSX } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProofSingleRow from './components/ProofSingleRow'
import ProofBox from './components/ProofBox'
import ProofContainer from './components/ProofContainer'

function App() {
  const [count, setCount] = useState(0)

  const proof: Proof = {
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



      <ProofContainer>
        {renderSteps(1, proof.steps)}
      </ProofContainer>
    </>
  )
}

function renderSteps(lineNumber: number, steps: (StepBox | StepLine)[]) {
  const children: JSX.Element[] = [];

  for (let i = 0; i < steps.length; i++) {
    children.push(renderSingleStep(lineNumber, steps[i]));
    lineNumber += countRowsInStep(steps[i]);
  }

  return children;
}

function renderSingleStep(lineNumber: number, step: StepBox | StepLine) {
  if (isStepLine(step)) {
    return (
      <ProofSingleRow lineNumber={lineNumber} step={step} />
    )
  }
  else {
    return (
      <ProofBox>
        {renderSteps(lineNumber, step.steps)}
      </ProofBox>
    )
  }
}

function countRowsInStep(step: StepBox | StepLine): number {
  if (isStepLine(step)) {
    return 1;
  }
  else {
    return sum(step.steps.map(countRowsInStep));
  }
}

function isStepLine(step: StepBox | StepLine): step is StepLine {
  return (step as StepLine).statement !== undefined;
}

function sum(list: number[]): number {
  return list.reduce((a, b) => a + b, 0);
}

export default App
