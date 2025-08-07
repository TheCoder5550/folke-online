import type { RuleMetaData } from "../helpers/rules-data"
import Modal from "./Modal/Modal";

interface RuleModalProps {
  rule?: [string, RuleMetaData];
  closeModal: () => void;
}

export default function RuleModal(props: RuleModalProps) {
  const rule = props.rule;
  const CurrentComp = rule == undefined ? undefined : rule[1].usageComponent;

  return (
    <Modal open={rule != undefined} closeModal={props.closeModal}>
      {rule && (
        <>
          <h2>{rule[1].name}</h2>
          <p>Symbol: <span style={{ fontFamily: "monospace" }}>{rule[0]}</span></p>
          <p>Arguments: {rule[1].nrArguments === 0 ? "-" : "(" + rule[1].argumentPlaceholders?.join(", ") + ")"}</p>
          <p>{rule[1].description}</p>
          <p>Usage:</p>
        </>
      )}
      {CurrentComp && <CurrentComp />}
    </Modal>
  )
}