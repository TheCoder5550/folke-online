import { getUUID, insertAtIndex, logProxy, sum } from "./generic-helper";
import { RULE_META_DATA } from "./rules-data";
import { makeSpecialCharacters } from "./special-characters";

export function createExercise(premises: string[], conclusion: string): FlatProof {
  return {
    premises: premises.map(p => makeSpecialCharacters(p)),
    conclusion: makeSpecialCharacters(conclusion),
    steps: [],
    stepLookup: {}
  }
}

export function createEmptyProof(): FlatProof {
  return {
    premises: [],
    conclusion: "",
    steps: [],
    stepLookup: {}
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

function getLine(proof: FlatProof, uuid: UUID): FlatLine {
  const step = getStep(proof, uuid);
  if (!isFlatLine(step)) {
    throw new Error("Requested step is not a line")
  }

  return step;
}

function getBox(proof: FlatProof, uuid: UUID): FlatBox {
  const step = getStep(proof, uuid);
  if (isFlatLine(step)) {
    throw new Error("Requested step is not a box")
  }

  return step;
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

export function moveAfter(proof: FlatProof, moveThis: UUID, afterThis: UUID): boolean {
  if (moveThis === afterThis) {
    return true;
  }

  const movedStep = getStep(proof, moveThis);
  removeFromProof(proof, moveThis);
  return insertAfter(proof, afterThis, movedStep);
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

export function canConvertToLine(proof: FlatProof, uuid: UUID): boolean {
  const line = getLine(proof, uuid);
  const parentUUID = line.parent;
  if (!parentUUID) {
    return false;
  }

  const parentBox = getBox(proof, parentUUID);
  if (parentBox.steps.length !== 1) {
    return false;
  }

  return true;
}

export function closeBoxWith(proof: FlatProof, uuid: UUID, insertThis: FlatStep) {
  const step = getStep(proof, uuid);
  const parentUUID = step.parent;
  if (!parentUUID) {
    throw new Error("Can't close main proof")
  }

  const parentStep = getStep(proof, parentUUID);
  if (isFlatLine(parentStep)) {
    throw new Error("Must be box")
  }

  if (parentStep.steps.indexOf(uuid) !== parentStep.steps.length - 1) {
    throw new Error("Must use this action on last line in box")
  }

  return insertAfter(proof, parentUUID, insertThis);
}

export function canCloseBox(proof: FlatProof, uuid: UUID): boolean {
  const line = getLine(proof, uuid);
  const parentUUID = line.parent;
  if (!parentUUID) {
    return false;
  }

  const parentBox = getBox(proof, parentUUID);
  if (parentBox.steps.indexOf(uuid) !== parentBox.steps.length - 1) {
    return false;
  }

  return true;
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

function getUUIDOfLastRowInBox(proof: FlatProof, boxUUID: UUID): UUID | null {
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

  const box = getBox(proof, boxUUID);
  return findUUID(box.steps);
}

export function getLineNumber(proof: FlatProof, uuid: UUID): string {
  let nextStep: UUID | null = uuid;
  let lineNumber = 1;

  lineNumber += proof.premises.length;

  while (nextStep != null) {
    const step = getStep(proof, nextStep);
    const parentUUID = step.parent;

    let steps: UUID[] = [];
    if (parentUUID) {
      steps = getBox(proof, parentUUID).steps;
    }
    else {
      steps = proof.steps;
    }

    for (let i = 0; i < steps.indexOf(step.uuid); i++) {
      lineNumber += countRowsInStep(proof, steps[i]);
    }

    nextStep = parentUUID;
  }

  const step = getStep(proof, uuid);
  if (!isFlatLine(step)) {
    const lastUUID = getUUIDOfLastRowInBox(proof, uuid)
    if (!lastUUID) {
      return "?-?"
    }
    return `${lineNumber}-${getLineNumber(proof, lastUUID)}`
  }

  return lineNumber.toString();
}

function countRowsInStep(proof: FlatProof, uuid: UUID): number {
  const step = getStep(proof, uuid);

  if (isFlatLine(step)) {
    return 1;
  }
  else {
    return sum(step.steps.map(uuid => countRowsInStep(proof, uuid)));
  }
}

export function isStepLine(step: Step): step is StepLine {
  return (step as StepLine).statement !== undefined;
}

export function isFlatLine(step: FlatStep): step is FlatLine {
  return (step as FlatLine).statement !== undefined;
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

export function proofToHaskellProof(proof: Proof): HaskellProof {
  const convertStep = (step: Step): HaskellStep => {
    if (isStepLine(step)) {
      return {
        tag: "Line",
        _arguments: step.arguments,
        _usedArguments: step.usedArguments,
        _rule: step.rule,
        _statement: step.statement,
      }
    }
    else {
      return {
        tag: "SubProof",
        contents: step.steps.map(convertStep)
      }
    }
  };

  return {
    _sequent: {
      _conclusion: proof.conclusion,
      _premises: proof.premises,
      _steps: proof.steps.map(convertStep)
    },
  };
}

export function haskellProofToProof(proof: HaskellProof): Proof {
  const convertStep = (step: HaskellStep): Step => {
    if (step.tag === "Line") {
      return {
        arguments: step._arguments,
        usedArguments: step._usedArguments,
        rule: step._rule,
        statement: step._statement,
      }
    }
    else {
      return {
        steps: step.contents.map(convertStep)
      }
    }
  };

  return {
    premises: proof._sequent._premises,
    conclusion: proof._sequent._conclusion,
    steps: proof._sequent._steps.map(convertStep),
  }
}