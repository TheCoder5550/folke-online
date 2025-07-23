export const RULE_META_DATA: { [id: string]: RuleMetaData | undefined } = {
  "premise": {
    name: "Premise",
    description: "",
    nrArguments: 0,
  },
  "assume": {
    name: "Assumption",
    description: "",
    nrArguments: 0,
  },
  "fresh": {
    name: "Fresh",
    description: "",
    nrArguments: 0,
  },
  "copy": {
    name: "Copy",
    description: "",
    nrArguments: 1,
  },
  "∧I": {
    name: "Conjunction introduction",
    description: "",
    nrArguments: 2,
  },
  "∧EL": {
    name: "Left conjunction elimination",
    description: "",
    nrArguments: 1,
  },
  "∧ER": {
    name: "Right conjunction elimination",
    description: "",
    nrArguments: 1,
  },
  "∨IL": {
    name: "Left disjunction introduction",
    description: "",
    nrArguments: 1,
  },
  "∨IR": {
    name: "Right disjunction introduction",
    description: "",
    nrArguments: 1,
  },
  "∨E": {
    name: "Disjunction elimination",
    description: "",
    nrArguments: 3,
  },
  "→I": {
    name: "Implication introduction",
    description: "",
    nrArguments: 1,
  },
  "→E": {
    name: "Implication elimination",
    description: "",
    nrArguments: 2,
  },
  "¬I": {
    name: "Negation introduction",
    description: "",
    nrArguments: 1,
  },
  "¬E": {
    name: "Negation elimination",
    description: "",
    nrArguments: 2,
  },
  "⊥E": {
    name: "Contradiction elimination",
    description: "",
    nrArguments: 1,
  },
  "¬¬I": {
    name: "Double negation introduction",
    description: "",
    nrArguments: 1,
  },
  "¬¬E": {
    name: "Double negation elimination",
    description: "",
    nrArguments: 1,
  },
  "MT": {
    name: "Modus tollens",
    description: "",
    nrArguments: 2,
  },
  "PBC": {
    name: "Proof by contradiction",
    description: "",
    nrArguments: 1,
  },
  "LEM": {
    name: "Law of excluded middle",
    description: "",
    nrArguments: 0,
  },
  "=I": {
    name: "Equality introduction",
    description: "",
    nrArguments: 0,
  },
  "=E": {
    name: "Equality elimination",
    description: "",
    nrArguments: 3,
    argumentLabels: ["", "", "𝝓(u)≡"],
    argumentInputLengths: [35, 35, 150]
  },
  "∀E": {
    name: "Universal elimination",
    description: "",
    nrArguments: 2,
  },
  "∀I": {
    name: "Universal introduction",
    description: "",
    nrArguments: 1,
  },
  "∃E": {
    name: "Existential elimination",
    description: "",
    nrArguments: 2,
  },
  "∃I": {
    name: "Existential introduction",
    description: "",
    nrArguments: 1,
  }
};