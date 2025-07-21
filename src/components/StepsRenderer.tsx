import useProofStore from "../stores/proof-store";
import { RenderStepMemo } from "./RenderStep";

export default function StepsRenderer() {
  const uuids = useProofStore((state) => state.proof.steps);
  
  return uuids.map(uuid => <RenderStepMemo key={uuid} uuid={uuid} />)
}