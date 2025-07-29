import { getLineNumber, isFlatLine } from "../helpers/proof-helper";
import StepsContainer from "./StepsContainer";

interface StaticProofRendererProps {
  proof: FlatProof;
}

export default function StaticProofRenderer(props: StaticProofRendererProps) {
  const proof = props.proof;
  const uuids = proof.steps;
  const premises = proof.premises;

  return (
    <StepsContainer style={{ gap: "0.5rem", fontFamily: "monospace", fontSize: "1rem" }}>
      {premises.map((premise, index) => (
        <Premise key={index} premise={premise} lineNumber={(index + 1).toString()} />
      ))}
      {uuids.map(uuid => (
        <RenderStep depth={0} key={uuid} proof={proof} uuid={uuid} />
      ))}
    </StepsContainer>
  )
}

interface PremiseProps {
  premise: string;
  lineNumber: string;
}

function Premise(props: PremiseProps) {
  return (
    <div style={{ display: "flex" }}>
      <span style={{ position: "absolute", left: "-3.5rem", textAlign: "right", width: "3rem" }}>{props.lineNumber}.</span>
      <span style={{ flex: "1" }}>{props.premise}</span>
      <span style={{ width: "200px", marginRight: "4rem" }}>premise</span>
    </div>
  )
}

interface RenderStepProps {
  proof: FlatProof;
  uuid: UUID;
  depth: number;
}

function RenderStep(props: RenderStepProps) {
  const step = props.proof.stepLookup[props.uuid];
  if (!step) {
    return <></>
  }

  if (isFlatLine(step)) {
    return <Line depth={props.depth} proof={props.proof} step={step} />
  }
  else {
    return <Box depth={props.depth} proof={props.proof} uuids={step.steps} />
  }
}

interface LineProps {
  proof: FlatProof;
  step: FlatLine;
  depth: number;
}

function Line(props: LineProps) {
  const lineNumber = getLineNumber(props.proof, props.step.uuid);
  let args = props.step.arguments
    .slice(0, props.step.usedArguments)
    .join(", ")
    .replaceAll("u:=", "𝝓(u)≡");

  if (props.step.usedArguments >= 2) {
    args = "(" + args + ")";
  }

  return (
    <div style={{ display: "flex" }}>
      <span style={{ position: "absolute", left: "-3.5rem", textAlign: "right", width: "3rem" }}>{lineNumber}.</span>
      <span style={{ flex: "1" }}>{props.step.statement}</span>
      <span style={{ width: "200px", marginRight: `calc(${4 - props.depth * 0.5}rem - ${props.depth}px)` }}>{props.step.rule} {args}</span>
    </div>
  )
}

interface BoxProps {
  proof: FlatProof;
  uuids: UUID[];
  depth: number;
}

function Box(props: BoxProps) {
  return (
    <div style={{ border: "1px solid black", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.5rem", paddingLeft: "1rem" }}>
      {props.uuids.map(uuid => (
        <RenderStep depth={props.depth + 1} proof={props.proof} uuid={uuid} key={uuid} />
      ))}
    </div>
  )
}