import { getUUID, insertAtIndex, logProxy, sum } from "./generic-helper";

export function createEmptyProof(): Proof {
  return {
    premises: [],
    conclusion: "",
    steps: []
  }
}

export function createNewLine(): FlatLine {
  return {
    uuid: getUUID(),
    parent: null,

    statement: "",
    rule: "",
    arguments: [],
    usedArguments: 0,
  }
}

export function createNewBox(): FlatBox {
  return {
    uuid: getUUID(),
    parent: null,

    steps: []
  }
}

export function setStatement(proof: FlatProof, uuid: UUID, statement: string) {
  const step = getStep(proof, uuid);
  if (!isFlatLine(step)) {
    throw new Error("Not a line");
  }

  step.statement = statement;
}

export function setRule(proof: FlatProof, uuid: UUID, rule: string) {
  const step = getStep(proof, uuid);
  if (!isFlatLine(step)) {
    throw new Error("Not a line");
  }

  const foundRule = RULE_META_DATA[rule];
  if (foundRule) {
    step.usedArguments = foundRule.nrArguments;
  }

  step.rule = rule;
}

export function setArgument(proof: FlatProof, uuid: UUID, index: number, argument: string) {
  const step = getStep(proof, uuid);
  if (!isFlatLine(step)) {
    throw new Error("Not a line");
  }

  step.arguments[index] = argument;
}

function getStep(proof: FlatProof, uuid: UUID): FlatStep {
  const step = proof.stepLookup[uuid];
  if (!step) {
    throw new Error("Step with uuid " + uuid + " does not exist in the proof")
  }

  return step;
}

export function removeFromProof(proof: FlatProof, uuid: UUID) {
  if (proof.stepLookup[uuid] == undefined) {
    throw new Error("Step does not exist in proof lookup table");
  }

  mapSteps(proof, (currentStep: FlatStep, localIndex: number, siblingUUIDs: UUID[]) => {
    if (currentStep.uuid === uuid) {
      siblingUUIDs.splice(localIndex, 1);
      currentStep.parent = null;
      delete proof.stepLookup[uuid];
      return true;
    }

    return false;
  });

  removeInvalid(proof);
}

function removeInvalid(proof: FlatProof) {
  mapSteps(proof, (currentStep: FlatStep, localIndex: number, siblingUUIDs: UUID[]) => {
    if (!isValidStep(currentStep)) {
      siblingUUIDs.splice(localIndex, 1);
      currentStep.parent = null;
      delete proof.stepLookup[currentStep.uuid];
    }

    return false;
  });
}

function isValidStep(step: FlatStep): boolean {
  if (isFlatLine(step)) {
    return true;
  }
  else {
    return step.steps.length > 0;
  }
}

export function insertAfter(proof: FlatProof, uuid: UUID, step: FlatStep): boolean {
  return insertRelative(proof, uuid, 1, step);
}

export function insertBefore(proof: FlatProof, uuid: UUID, step: FlatStep): boolean {
  return insertRelative(proof, uuid, 0, step);
}

export function insertInto(proof: FlatProof, uuid: UUID, step: FlatStep): boolean {
  return insertSomewhere(proof, uuid, step, (currentStep: FlatStep) => {
    if (isFlatLine(currentStep)) {
      throw new Error("Can't insert into line");
    }

    currentStep.steps.push(step.uuid);
    step.parent = currentStep.uuid;
  })
}

function insertRelative(proof: FlatProof, uuid: UUID, offset: number, step: FlatStep): boolean {
  return insertSomewhere(proof, uuid, step, (_currentStep: FlatStep, localIndex: number, siblingUUIDs: UUID[]) => {
    insertAtIndex(siblingUUIDs, localIndex + offset, step.uuid);
  })
}

function insertSomewhere(proof: FlatProof, uuid: UUID, step: FlatStep, func: (currentStep: FlatStep, localIndex: number, siblingUUIDs: UUID[]) => void): boolean {
  if (proof.stepLookup[step.uuid] != undefined) {
    throw new Error("Step is already in proof");
  }

  proof.stepLookup[step.uuid] = step;

  return mapSteps(proof, (currentStep: FlatStep, localIndex: number, siblingUUIDs: UUID[], parentUUID) => {
    if (currentStep.uuid === uuid) {
      step.parent = parentUUID;
      func(currentStep, localIndex, siblingUUIDs);
      return true;
    }

    return false;
  });
}

function mapSteps(proof: FlatProof, mapFunc: (currentStep: FlatStep, localIndex: number, siblingUUIDs: UUID[], parentUUID: UUID | null) => boolean): boolean {
  const findUUID = (uuids: UUID[], parentUUID: UUID | null): boolean => {
    for (let i = 0; i < uuids.length; i++) {
      const currentUUID = uuids[i];
      const currentStep = proof.stepLookup[currentUUID];
      if (!currentStep) {
        logProxy(proof);
        throw new Error("UUID has not been added to lookup: " + currentUUID);
      }

      if (!isFlatLine(currentStep)) {
        const found = findUUID(currentStep.steps, currentUUID);
        if (found) {
          return true;
        }
      }

      const result = mapFunc(currentStep, i, uuids, parentUUID);
      if (result) {
        return true;
      }
    }

    return false;
  };

  return findUUID(proof.steps, null);
}

export function convertToBox(proof: FlatProof, uuid: UUID) {
  if (proof.stepLookup[uuid] == undefined) {
    throw new Error("Step does not exist in proof lookup table");
  }

  return mapSteps(proof, (currentStep: FlatStep, localIndex: number, siblingUUIDs: UUID[], parentUUID) => {
    if (currentStep.uuid === uuid) {
      const box = createNewBox();
      box.steps.push(currentStep.uuid);
      box.parent = parentUUID;
      
      proof.stepLookup[box.uuid] = box;
      siblingUUIDs[localIndex] = box.uuid;

      currentStep.parent = box.uuid;

      return true;
    }

    return false;
  });
}

export function convertToLine(proof: FlatProof, uuid: UUID) {
  if (proof.stepLookup[uuid] == undefined) {
    throw new Error("Step does not exist in proof lookup table");
  }

  return mapSteps(proof, (currentStep: FlatStep) => {
    if (currentStep.uuid === uuid) {
      const parentUUID = currentStep.parent;
      if (parentUUID == null) {
        throw new Error("Must be inside a box")
      }

      const parentStep = getStep(proof, parentUUID);
      if (isFlatLine(parentStep)) {
        throw new Error("Must be a box");
      }

      if (parentStep.steps.length !== 1) {
        throw new Error("Box must have exactly 1 child");
      }

      let grandParentChildren: string[] = [];
      if (parentStep.parent == null) {
        grandParentChildren = proof.steps;
      }
      else {
        const grandParentStep = getStep(proof, parentStep.parent);
        if (isFlatLine(grandParentStep)) {
          throw new Error("Grand parent must be box")
        }
        grandParentChildren = grandParentStep.steps;
      }

      grandParentChildren[grandParentChildren.indexOf(parentUUID)] = currentStep.uuid;
      currentStep.parent = parentStep.parent;
      delete proof.stepLookup[parentUUID];

      return true;
    }

    return false;
  });
}

export function closeBoxWith(proof: FlatProof, uuid: UUID, insertThis: FlatStep) {
  const step = getStep(proof, uuid);
  const parentUUID = step.parent;
  logProxy(step);
  if (!parentUUID) {
    throw new Error("Can't close main proof")
  }

  const parentStep = getStep(proof, parentUUID);
  if (isFlatLine(parentStep)) {
    throw new Error("Must be box")
  }

  console.log(parentStep.steps.indexOf(uuid), parentStep.steps, uuid);

  if (parentStep.steps.indexOf(uuid) !== parentStep.steps.length - 1) {
    throw new Error("Must use this action on last line in box")
  }

  return insertAfter(proof, parentUUID, insertThis);
}

export function getUUIDOfLastRow(proof: FlatProof): UUID | null {
  const findUUID = (uuids: UUID[]): UUID | null => {
    const lastUUID = uuids[uuids.length - 1];
    if (!lastUUID) {
      return null;
    }

    const lastStep = getStep(proof, lastUUID);
    if (isFlatLine(lastStep)) {
      return lastUUID;
    }
    else {
      return findUUID(lastStep.steps);
    }
  };

  return findUUID(proof.steps);
}

// export function getPathToLastRow(proof: Proof): StepPath {
//   const path: StepPath = [];
//   let list = proof.steps;

//   while (list.length !== 0) {
//     path.push(list.length - 1);
//     const lastElement = list[list.length - 1];

//     if (isStepLine(lastElement)) {
//       break;
//     }
    
//     list = lastElement.steps;
//   }

//   return path;
// }

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

export function isFlatLine(step: FlatStep): step is FlatLine {
  return (step as FlatLine).statement !== undefined;
}

export function getParent(path: StepPath): StepPath {
  const pathToParentBox = [...path];
  pathToParentBox.pop();
  return pathToParentBox;
}

export function flattenProof(proof: Proof): FlatProof {
  const stepLookup: StepLookup = {};

  const flattenSteps = (steps: Step[], parentUUID: UUID | null): UUID[] => {
    return steps.map(step => {
      if (isStepLine(step)) {
        const flat: FlatLine = {
          ...step,
          uuid: getUUID(),
          parent: parentUUID,
        }
        stepLookup[flat.uuid] = flat;
        return flat.uuid;
      }
      else {
        const uuid = getUUID();
        const flat: FlatBox = {
          steps: flattenSteps(step.steps, uuid),
          uuid: uuid,
          parent: parentUUID,
        }
        stepLookup[flat.uuid] = flat;
        return flat.uuid;
      }
    })
  };
 
  const steps = flattenSteps(proof.steps, null);

  return {
    premises: proof.premises,
    conclusion: proof.conclusion,
    steps: steps,
    stepLookup: stepLookup,
  }
}

export function unflattenProof(proof: FlatProof): Proof {
  const unflattenSteps = (uuids: UUID[]): Step[] => {
    return uuids.map(uuid => {
      const step = getStep(proof, uuid);
      if (isFlatLine(step)) {
        return {
          statement: step.statement,
          rule: step.rule,
          arguments: step.arguments,
          usedArguments: step.usedArguments,
        }
      }
      else {
        return {
          steps: unflattenSteps(step.steps)
        }
      }
    })
  };

  return {
    premises: proof.premises,
    conclusion: proof.conclusion,
    steps: unflattenSteps(proof.steps)
  }
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

export const RULE_META_DATA: { [id: string]: RuleMetaData | undefined } = {
  "premise": {
    name: "Premise",
    description: "",
    nrArguments: 0,
  },
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