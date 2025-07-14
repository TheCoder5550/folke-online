interface Proof {
  premises: string[];
  conclusion: string;
  steps: (StepBox | StepLine)[];
}

interface StepBox {
  steps: (StepBox | StepLine)[];
}

interface StepLine {
  statement: string;
  rule: string;
  arguments: string[];
}