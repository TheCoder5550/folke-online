import { sum } from "./generic-helper";

export const EMPTY_PROOF: Proof = {
  premises: [],
  conclusion: "",
  steps: []
} as const;

export function setStatement(proof: Proof, path: StepPath, statement: string) {
  return applyToProofStep(proof, path, (old) => {
    if (!isStepLine(old)) {
      throw new Error("Not a line");
    }

    old.statement = statement;
    return old;
  });
}

export function setRule(proof: Proof, path: StepPath, rule: string) {
  return applyToProofStep(proof, path, (old) => {
    if (!isStepLine(old)) {
      throw new Error("Not a line");
    }

    old.rule = rule;
    return old;
  });
}

export function setArgument(proof: Proof, path: StepPath, index: number, argument: string) {
  return applyToProofStep(proof, path, (old) => {
    if (!isStepLine(old)) {
      throw new Error("Not a line");
    }
    
    old.arguments[index] = argument;
    return old;
  });
}

function applyToProofStep(proof: Proof, path: StepPath, func: (stepLine: Step) => Step) {
  const pathCopy = [...path];
  let currentList = proof.steps;

  while (pathCopy.length >= 1) {
    const index = pathCopy.shift();
    if (index == null) {
      throw new Error("No index left");
    }
    const step = currentList[index];

    if (pathCopy.length === 0) {
      currentList[index] = func(step);
    }
    else {
      if (isStepLine(step)) {
        throw new Error("Can't index into line");
      }
      else {
        currentList = step.steps;
      }
    }
  }

  return proof;
}

export function countRowsInStep(step: Step): number {
  if (isStepLine(step)) {
    return 1;
  }
  else {
    return sum(step.steps.map(countRowsInStep));
  }
}

export function isStepLine(step: Step): step is StepLine {
  return (step as StepLine).statement !== undefined;
}