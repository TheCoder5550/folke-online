import type { JSX } from "react";
import { countRowsInStep, isStepLine } from "../helpers/proof-helper";
import ProofSingleRow from "./ProofSingleRow";
import ProofBox from "./ProofBox";
import { useProof } from "../helpers/ProofContext";

export default function StepsRenderer() {
  const proof = useProof();
  return renderSteps(1, [], proof.steps);
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