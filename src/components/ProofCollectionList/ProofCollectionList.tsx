import styles from "./ProofCollectionList.module.css";
import { cls } from "../../helpers/generic-helper";
import { getSequent, isProofEmpty } from "../../helpers/proof-helper";
import useProofStore from "../../stores/proof-store";
import { useShallow } from "zustand/shallow";

export default function ProofCollectionList() {
  const sequents = useProofStore(useShallow((state) => state.proofs
    .map(d => d.proof)
    .map(proof => isProofEmpty(proof) ? "New proof" : proof.name ?? getSequent(proof))
  ));
  const reversed = sequents
    .map((l, i) => ([l, i]))
    .reverse() as [string, number][];
  
  const activeIndex = useProofStore((state) => state.index);
  const setActiveProof = useProofStore((state) => state.setActiveProof);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
    }}>
      {reversed.map(([sequent, index]) => (
        <button
          key={index}
          type="button"
          onClick={() => setActiveProof(index)}
          className={cls("action-button", activeIndex === index && styles["selected"])}
          style={{
            height: "auto",
            justifyContent: "flex-start",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
        >
          {sequent}
        </button>
      ))}
    </div>
  )
}