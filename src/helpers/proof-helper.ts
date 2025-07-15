import { sum } from "./generic-helper";

export const EMPTY_PROOF: Proof = {
  premises: [],
  conclusion: "",
  steps: []
} as const;

export function createNewLine(): StepLine {
  return {
    statement: "",
    rule: "",
    arguments: [],
    usedArguments: 0,
  }
}

export function createNewBox(): StepBox {
  return {
    steps: [
      createNewLine()
    ]
  }
}

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

    const foundRule = ruleMetaData[rule];
    if (foundRule) {
      old.usedArguments = foundRule.nrArguments;
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

export function removeFromProof(proof: Proof, path: StepPath) {
  const pathCopy = [...path];
  let currentList = proof.steps;

  while (pathCopy.length >= 1) {
    const index = pathCopy.shift();
    if (index == null) {
      throw new Error("No index left");
    }
    const step = currentList[index];

    if (pathCopy.length === 0) {
      currentList.splice(index, 1);
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

  removeInvalidFromProof(proof);

  return proof;
}

function removeInvalidFromProof(proof: Proof): Proof {
  proof.steps = removeInvalidFromSteps(proof.steps);
  return proof;
}

function removeInvalidFromSteps(steps: Step[]): Step[] {
  return steps.map(s => {
    if (isStepLine(s)) {
      return s;
    }
    else {
      return {
        steps: removeInvalidFromSteps(s.steps)
      }
    }
  }).filter(isValidStep);
}

function isValidStep(step: Step) {
  if (isStepLine(step)) {
    return true;
  }
  else {
    return step.steps.length > 0;
  }
}

export function insertAfter(proof: Proof, path: StepPath, step: Step) {
  const pathCopy = [...path];
  let currentList = proof.steps;

  while (pathCopy.length >= 1) {
    const index = pathCopy.shift();
    if (index == null) {
      throw new Error("No index left");
    }
    const currentStep = currentList[index];

    if (pathCopy.length === 0) {
      currentList.splice(index + 1, 0, step);
    }
    else {
      if (isStepLine(currentStep)) {
        throw new Error("Can't index into line");
      }
      else {
        currentList = currentStep.steps;
      }
    }
  }

  return proof;
}

export function insertBefore(proof: Proof, path: StepPath, step: Step) {
  const pathCopy = [...path];
  let currentList = proof.steps;

  while (pathCopy.length >= 1) {
    const index = pathCopy.shift();
    if (index == null) {
      throw new Error("No index left");
    }
    const currentStep = currentList[index];

    if (pathCopy.length === 0) {
      currentList.splice(index, 0, step);
    }
    else {
      if (isStepLine(currentStep)) {
        throw new Error("Can't index into line");
      }
      else {
        currentList = currentStep.steps;
      }
    }
  }

  return proof;
}

export function convertToBox(proof: Proof, path: StepPath) {
  return applyToProofStep(proof, path, (old) => {
    if (!isStepLine(old)) {
      throw new Error("Not a line");
    }

    return {
      steps: [
        old
      ]
    };
  });
}

export function convertToLine(proof: Proof, path: StepPath) {
  const pathToParentBox = [...path];
  pathToParentBox.pop();

  return applyToProofStep(proof, pathToParentBox, (old) => {
    if (isStepLine(old)) {
      throw new Error("Not a box");
    }

    if (old.steps.length !== 1) {
      throw new Error("Not a singleton");
    }

    return old.steps[0];
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

export function getPathToLastRow(proof: Proof): StepPath {
  const path: StepPath = [];
  let list = proof.steps;

  while (list.length !== 0) {
    path.push(list.length - 1);
    const lastElement = list[list.length - 1];

    if (isStepLine(lastElement)) {
      break;
    }
    
    list = lastElement.steps;
  }

  return path;
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

export function makeSpecialCharacters(text: string) {
  for (const [key, value] of characterLookupTable) {
    text = text.replaceAll(key, value);
  }
  return text;
}

const characterLookupTable = [
  // Negate
  ["!", "¬"],
  ["~", "¬"],
  ["not", "¬"],

  // Implies
  [">", "→"],
  ["->", "→"],
  ["¬>", "→"], // Fix for when "-" becomes negation

  // And
  ["&", "∧"],
  ["^", "∧"],
  ["*", "∧"],
  ["and", "∧"],
  ["con", "∧"],

  // Or
  ["|", "∨"],
  //["v", "∨"],
  ["+", "∨"],
  ["f∨", "for"], // Disable `or` replacement when writing forall
  ["or", "∨"],
  ["dis", "∨"],

  // Bottom
  ["bot", "⊥"],
  ["#", "⊥"],
  ["XX", "⊥"],

  // For all
  ["all", "∀"],
  ["forall", "∀"],
  // ["A", "∀"],

  // There exists
  ["exists", "∃"],
  ["some", "∃"],
  // ["E", "∃"],

  // Sequent
  ["=/>", "⊬"],
  ["=>", "⊢"],

  // Subscript
  ["_0", "₀"],
  ["_1", "₁"],
  ["_2", "₂"],
  ["_3", "₃"],
  ["_4", "₄"],
  ["_5", "₅"],
  ["_6", "₆"],
  ["_7", "₇"],
  ["_8", "₈"],
  ["_9", "₉"]
].reverse();

const ruleMetaData: { [id: string]: RuleMetaData | undefined } = {
  "assume": {
    name: "Assumption",
    description: "",
    nrArguments: 0,
  },
  "fresh": {
    name: "Fresh",
    description: "",
    nrArguments: 0,
  },
  "copy": {
    name: "Copy",
    description: "",
    nrArguments: 1,
  },
  "∧I": {
    name: "Conjunction introduction",
    description: "",
    nrArguments: 2,
  },
  "∧EL": {
    name: "Left conjunction elimination",
    description: "",
    nrArguments: 1,
  },
  "∧ER": {
    name: "Right conjunction elimination",
    description: "",
    nrArguments: 1,
  },
  "∨IL": {
    name: "Left disjunction introduction",
    description: "",
    nrArguments: 1,
  },
  "∨IR": {
    name: "Right disjunction introduction",
    description: "",
    nrArguments: 1,
  },
  "∨E": {
    name: "Disjunction elimination",
    description: "",
    nrArguments: 3,
  },
  "→I": {
    name: "Implication introduction",
    description: "",
    nrArguments: 1,
  },
  "→E": {
    name: "Implication elimination",
    description: "",
    nrArguments: 2,
  },
  "¬I": {
    name: "Negation introduction",
    description: "",
    nrArguments: 1,
  },
  "¬E": {
    name: "Negation elimination",
    description: "",
    nrArguments: 2,
  },
  "⊥E": {
    name: "Contradiction elimination",
    description: "",
    nrArguments: 1,
  },
  "¬¬I": {
    name: "Double negation introduction",
    description: "",
    nrArguments: 1,
  },
  "¬¬E": {
    name: "Double negation elimination",
    description: "",
    nrArguments: 1,
  },
  "MT": {
    name: "Modus tollens",
    description: "",
    nrArguments: 2,
  },
  "PBC": {
    name: "Proof by contradiction",
    description: "",
    nrArguments: 1,
  },
  "LEM": {
    name: "Law of excluded middle",
    description: "",
    nrArguments: 0,
  },
  "=I": {
    name: "Equality introduction",
    description: "",
    nrArguments: 0,
  },
  "=E": {
    name: "Equality elimination",
    description: "",
    nrArguments: 3,
    argumentLabels: ["", "", "𝝓(u)≡"],
    argumentInputLengths: [45, 45, 150]
  },
  "∀E": {
    name: "Universal elimination",
    description: "",
    nrArguments: 2,
  },
  "∀I": {
    name: "Universal introduction",
    description: "",
    nrArguments: 1,
  },
  "∃E": {
    name: "Existential elimination",
    description: "",
    nrArguments: 2,
  },
  "∃I": {
    name: "Existential introduction",
    description: "",
    nrArguments: 1,
  }
};