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
}

type StepPath = number[]