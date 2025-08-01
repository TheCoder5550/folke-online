type Step = StepBox | StepLine;

interface Proof {
  premises: string[];
  conclusion: string;
  steps: Step[];
}

interface StepBox {
  steps: Step[];
}

interface StepLine {
  statement: string;
  rule: string;
  arguments: string[];
  usedArguments: number;
}

type StepPath = number[]

interface RuleMetaData {
  name: string;
  description: string;
  nrArguments: number;
  argumentLabels?: string[];
  argumentInputLengths?: number[];
}

/*
  Flat proof
*/

type UUID = string;

interface FlatProof {
  premises: string[];
  conclusion: string;
  steps: UUID[];
  stepLookup: StepLookup;
}

type StepLookup = {
  [id: UUID]: FlatStep | undefined
};

type FlatStep = FlatBox | FlatLine;

interface FlatLine {
  uuid: UUID;
  parent: UUID | null;

  statement: string;
  rule: string;
  arguments: string[];
  usedArguments: number;
}

interface FlatBox {
  uuid: UUID;
  parent: UUID | null;
  
  steps: UUID[];
}

/*
  Haskell proof structure
*/

interface HaskellProof {
  _sequent: {
    _conclusion: string;
    _premises: string[];
    _steps: HaskellStep[];
  }
  _fedUserDefinedRules?: HaskellUserDefinedRule[] | null
}

interface HaskellUserDefinedRule {
  _udrInput: string[];
  _udrOutput: string;
  _udrName: string;
  _udrPath: string;
}

type HaskellStep = {
  tag: "Line";
  _arguments: string[];
  _rule: string;
  _statement: string;
  _usedArguments: number;
} | {
  tag: "SubProof",
  contents: HaskellStep[]
}

/*
  Haskell result
*/

interface CheckProofResult {
  correct: boolean;
  message?: string;
  location?: number | string;
}