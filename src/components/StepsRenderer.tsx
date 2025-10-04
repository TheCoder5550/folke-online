import useProofStore from "../stores/proof-store";
import { PremiseMemo } from "./Premise";
import { RenderStepMemo } from "./RenderStep";

export default function StepsRenderer() {
  const uuids = useProofStore((state) => state.getProof().steps);
  const premises = useProofStore((state) => state.getProof().premises);

  return (
    <>
      {premises.map((premise, index) => (
        // eslint-disable-next-line react-x/no-array-index-key
        <PremiseMemo key={index} premise={premise} lineNumber={(index + 1).toString()} />
      ))}
      {uuids.map(uuid => (
        <RenderStepMemo key={uuid} uuid={uuid} />
      ))}
    </>
  )
}