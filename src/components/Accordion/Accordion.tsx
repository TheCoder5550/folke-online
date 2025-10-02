import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { cls } from "../../helpers/generic-helper";
import RuleDictionary from "../RuleDictionary/RuleDictionary";
import styles from "./Accordion.module.css";
import { useState, type PropsWithChildren } from "react";
import { useProofCollectionStore } from "../../stores/proof-collection-store";
import { getSequent } from "../../helpers/proof-helper";

type AccordionProps = React.ButtonHTMLAttributes<HTMLDivElement> & PropsWithChildren & {
}

export default function Accordion({ className, ...other }: AccordionProps) {
  const proofs = useProofCollectionStore((state) => state.proofs);

  const [open, setOpen] = useState([true, false]);

  const toggleOpen = (index: number) => {
    setOpen(open => {
      const newOpen = [...open];
      newOpen[index] = !newOpen[index];
      return newOpen;
    })
  }

  return (
    <div
      className={cls(styles["accordion"], className)}
      {...other}
    >
      <div className={cls(styles["fold"], open[0] && styles["open"])}>
        <button
          type="button"
          className={styles["handle"]}
          onClick={() => toggleOpen(0)}
          title="Click to expand/collapse"
        >
          {open[0] ? (
            <FaChevronDown size="0.75em" />
          ) : (
            <FaChevronRight size="0.75em" />
          )}
          <span>Proofs</span>
        </button>
        {open[0] && (
          <div className={styles["body"]}>
            {proofs.map((proof, index) => (
              <button
                key={index}
                type="button"
              >
                {getSequent(proof)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={cls(styles["fold"], open[1] && styles["open"])}>
        <button
          type="button"
          className={styles["handle"]}
          onClick={() => toggleOpen(1)}
          title="Click to expand/collapse"
        >
          {open[1] ? (
            <FaChevronDown size="0.75em" />
          ) : (
            <FaChevronRight size="0.75em" />
          )}
          <span>Rule guide</span>
        </button>
        {open[1] && (
          <div className={styles["body"]}>
            <RuleDictionary />
          </div>
        )}
      </div>
    </div>
  )
}