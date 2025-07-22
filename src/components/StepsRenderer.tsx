import useProofStore from "../stores/proof-store";
import { PremiseMemo } from "./Premise";
import { RenderStepMemo } from "./RenderStep";

export default function StepsRenderer() {
  const uuids = useProofStore((state) => state.proof.steps);
  const premises = useProofStore((state) => state.proof.premises);

  return (
    <>
      {premises.map((premise, index) => (
        <PremiseMemo key={index} premise={premise} lineNumber={(index + 1).toString()} />
      ))}
      {uuids.map(uuid => (
        <RenderStepMemo key={uuid} uuid={uuid} />
      ))}
    </>
  )
}