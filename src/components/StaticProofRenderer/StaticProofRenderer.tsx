import styles from "./StaticProofRenderer.module.css";
import { getLineNumber, isFlatLine } from "../../helpers/proof-helper";
import StepsContainer from "../StepsContainer/StepsContainer";

interface StaticProofRendererProps {
  proof: FlatProof;
}

export default function StaticProofRenderer(props: StaticProofRendererProps) {
  const proof = props.proof;
  const uuids = proof.steps;
  const premises = proof.premises;

  return (
    <StepsContainer className={styles["container"]}>
      {premises.map((premise, index) => (
        // eslint-disable-next-line react-x/no-array-index-key
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
    <div className={styles["line"]}>
    <span className={styles["number"]}>{props.lineNumber}.</span>
    <span className={styles["statement"]}>{props.premise}</span>
    <span
      className={styles["rule"]}
      style={{ marginRight: "4em" }}
    >premise</span>
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
    <div className={styles["line"]}>
      <span className={styles["number"]}>{lineNumber}.</span>
      <span className={styles["statement"]}>{props.step.statement}</span>
      <span
        className={styles["rule"]}
        style={{ marginRight: `calc(${4 - props.depth * 0.5}em - ${props.depth}px)` }}
      >{props.step.rule} {args}</span>
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
    <div style={{ border: "1px solid rgb(var(--text-rgb), 0.75)", display: "flex", flexDirection: "column", gap: "0.5em", padding: "0.5em", paddingLeft: "1em" }}>
      {props.uuids.map(uuid => (
        <RenderStep depth={props.depth + 1} proof={props.proof} uuid={uuid} key={uuid} />
      ))}
    </div>
  )
}