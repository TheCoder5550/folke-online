import React from "react";
import type { RuleMetaData } from "../helpers/rules-data"
import Modal from "./Modal/Modal";
import Chip from "./Chip/Chip";

interface RuleModalProps {
  rule?: [string, RuleMetaData];
  closeModal: () => void;
}

export default function RuleModal(props: RuleModalProps) {
  const rule = props.rule;
  const CurrentComp = rule == undefined ? undefined : rule[1].usageComponent;
  const ExampleComps = rule == undefined ? undefined : rule[1].exampleComponents;

  return (
    <Modal open={rule != undefined} closeModal={props.closeModal}>
      {rule && (
        <>
          <h2>{rule[1].name}</h2>
          <p>{rule[1].description}</p>
        </>
      )}
      {CurrentComp && rule && (
        <>
          <h3>Usage</h3>

          <p>
            Symbol:
            <span style={{ fontFamily: "monospace" }}> {rule[0]}</span>
            <br />
            Written as:
            <span style={{ fontFamily: "monospace" }}> {getSimpleRuleSymbol(rule[0])}</span>
          </p>

          <p>
            {rule[1].nrArguments === 0 ? "" : "The rule requires " + rule[1].nrArguments + " argument" + (rule[1].nrArguments === 1 ? "" : "s") + ": "}
            {rule[1].argumentPlaceholders?.map((p, index) => (
              <Chip
                // eslint-disable-next-line react-x/no-array-index-key
                key={index}
              >{p}</Chip>
            ))}
          </p>
          
          <CurrentComp />  
        </>
      )}

      <br />
      <h3>Examples</h3>

      {ExampleComps ? ExampleComps.map((Comp, index) => (
        // eslint-disable-next-line react-x/no-array-index-key
        <React.Fragment key={index}>
          <Comp />
          <br />
        </React.Fragment>
      )) : (
        <span>No examples provided.</span>
      )}
    </Modal>
  )
}

function getSimpleRuleSymbol(rule: string): string {
  return rule
    .replaceAll("¬", "!")
    .replaceAll("→", "->")
    .replaceAll("∧", "&")
    .replaceAll("∨", "|")
    .replaceAll("⊥", "bot")
    .replaceAll("∀", "all")
    .replaceAll("∃", "some")
}