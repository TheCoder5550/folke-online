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