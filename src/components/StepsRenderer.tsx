import { isFlatLine } from "../helpers/proof-helper";
import { ProofSingleRowMemo } from "./ProofSingleRow";
import { ProofBoxMemo } from "./ProofBox";
import useProofStore from "../stores/proof-store";
import { memo } from "react";

export default function StepsRenderer() {
  const uuids = useProofStore((state) => state.proof.steps);

  return uuids.map(uuid => <RenderUUIDMemo key={uuid} uuid={uuid} />)
}

export const RenderUUIDMemo = memo(RenderUUID);

export function RenderUUID(props: { uuid: UUID }) {
  const isLine = useProofStore((state) => {
    const step = state.proof.stepLookup[props.uuid];
    return step && isFlatLine(step);
  });

  if (isLine) {
    return <ProofSingleRowMemo lineNumber={0} uuid={props.uuid} />
  }
  else {
    return <ProofBoxMemo uuid={props.uuid} />
  }
}

// function renderStructure(structure: ProofStructure) {
//   return structure.map(s => {
//     const key = s.uuid;//s.path.join(",");//getStepKey(s);

//     if (!isLineStructure(s)) {
//       return (
//         <ProofBox key={key}>
//           {renderStructure(s.steps)}
//         </ProofBox>
//       )
//     }
//     else {
//       return (
//         <ProofSingleRowMemo key={key} lineNumber={s.lineNumber} uuid={s.uuid} />
//       )
//     }
//   })
// }

// function renderSteps(lineNumber: number, path: StepPath, steps: Step[]) {
//   const children: JSX.Element[] = [];

//   for (let i = 0; i < steps.length; i++) {
//     const nextPath = [...path, i];
//     children.push(renderSingleStep(lineNumber, nextPath, steps[i]));
//     lineNumber += countRowsInStep(steps[i]);
//   }

//   return children;
// }

// function renderSingleStep(lineNumber: number, path: StepPath, step: Step) {
//   const key = path.join(",");

//   if (isStepLine(step)) {
//     return (
//       <ProofSingleRowMemo key={key} lineNumber={lineNumber} path={path} />
//     )
//   }
//   else {
//     return (
//       <ProofBox key={key}>
//         {renderSteps(lineNumber, path, step.steps)}
//       </ProofBox>
//     )
//   }
// }

// interface LineStructure {
//   lineNumber: number;
//   path: StepPath;
//   uuid: string;
// }
// interface BoxStructure {
//   path: StepPath;
//   steps: ProofStructure;
//   uuid: string;
// }
// type ProofStructure = (LineStructure | BoxStructure)[]

// function compareProofStructure(a: ProofStructure, b: ProofStructure) {
//   if (a === b) {
//     return true;
//   }

//   if (a.length !== b.length) {
//     return false;
//   }

//   for (let i = 0; i < a.length; i++) {
//     const ai = a[i];
//     const bi = b[i];

//     if (isLineStructure(ai) !== isLineStructure(bi)) {
//       return false;
//     }

//     if (isLineStructure(ai) && isLineStructure(bi) && !compareLineStructure(ai, bi)) {
//       return false;
//     }

//     if (!isLineStructure(ai) && !isLineStructure(bi) && !compareBoxStructure(ai, bi)) {
//       return false;
//     }
//   }

//   return true;
// }

// function compareLineStructure(a: LineStructure, b: LineStructure) {
//   return (
//     a.lineNumber === b.lineNumber &&
//     compareStepPath(a.path, b.path) &&
//     a.uuid === b.uuid
//   );
// }

// function compareBoxStructure(a: BoxStructure, b: BoxStructure) {
//   return (
//     compareStepPath(a.path, b.path) &&
//     compareProofStructure(a.steps, b.steps) &&
//     a.uuid === b.uuid
//   );
// }

// function compareStepPath(a: StepPath, b: StepPath) {
//   if (a === b) {
//     return true;
//   }

//   if (a.length !== b.length) {
//     return false;
//   }

//   for (let i = 0; i < a.length; i++) {
//     if (a[i] !== b[i]) {
//       return false;
//     }
//   }

//   return true;
// }

// function getProofStructure(steps: Step[], path: StepPath = [], lineNumber: number): ProofStructure {
//   return steps.map((step, index) => {
//     const thisPath = [...path, index];
//     const oldLineNumber = lineNumber;
//     lineNumber += countRowsInStep(step);
//     if (isStepLine(step)) {
//       return {
//         lineNumber: oldLineNumber,
//         path: thisPath,
//         uuid: step.uuid
//       };
//     }
//     else {
//       return {
//         path: thisPath,
//         steps: getProofStructure(step.steps, thisPath, oldLineNumber),
//         uuid: step.uuid
//       };
//     }
//   });
// }

// function isLineStructure(step: LineStructure | BoxStructure): step isLine  {
//   return (step as LineStructure).lineNumber !== undefined;
// }