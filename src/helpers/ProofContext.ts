import { createContext } from "react";

export interface ProofContextData {
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