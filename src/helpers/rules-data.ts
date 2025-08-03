import type { JSX } from "react";
import Assume from "../components/RuleDictionary/Assume";
import Fresh from "../components/RuleDictionary/Fresh";
import Copy from "../components/RuleDictionary/Copy";
import ConjunctionIntro from "../components/RuleDictionary/ConjunctionIntro";
import ConjunctionElimLeft from "../components/RuleDictionary/ConjunctionElimLeft";
import ConjunctionElimRight from "../components/RuleDictionary/ConjunctionElimRight";
import DisjunctionIntroLeft from "../components/RuleDictionary/DisjunctionIntroLeft";
import DisjunctionIntroRight from "../components/RuleDictionary/DisjunctionIntroRight";
import DisjunctionElim from "../components/RuleDictionary/DisjunctionElim";
import ImplicationIntro from "../components/RuleDictionary/ImplicationIntro";
import ImplicationElim from "../components/RuleDictionary/ImplicationElim";
import NegationIntro from "../components/RuleDictionary/NegationIntro";
import NegationElim from "../components/RuleDictionary/NegationElim";
import ContradictionElim from "../components/RuleDictionary/ContradictionElim";
import DoubleNegationIntro from "../components/RuleDictionary/DoubleNegationIntro";
import DoubleNegationElim from "../components/RuleDictionary/DoubleNegationElim";
import MT from "../components/RuleDictionary/MT";
import PBC from "../components/RuleDictionary/PBC";
import LEM from "../components/RuleDictionary/LEM";
import EqualityIntro from "../components/RuleDictionary/EqualityIntro";
import EqualityElim from "../components/RuleDictionary/EqualityElim";
import UniversalElim from "../components/RuleDictionary/UniversalElim";
import UniversalIntro from "../components/RuleDictionary/UniversalIntro";
import ExistentialElim from "../components/RuleDictionary/ExistentialElim";
import ExistentialIntro from "../components/RuleDictionary/ExistentialIntro";

export interface RuleMetaData {
  name: string;
  description: string;
  nrArguments: number;
  argumentLabels?: string[];
  argumentInputLengths?: number[];
  usageComponent?: () => JSX.Element;
}

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
    usageComponent: Assume,
  },
  "fresh": {
    name: "Fresh",
    description: "",
    nrArguments: 0,
    usageComponent: Fresh,
  },
  "copy": {
    name: "Copy",
    description: "",
    nrArguments: 1,
    usageComponent: Copy,
  },
  "∧I": {
    name: "Conjunction introduction",
    description: "",
    nrArguments: 2,
    usageComponent: ConjunctionIntro,
  },
  "∧EL": {
    name: "Left conjunction elimination",
    description: "",
    nrArguments: 1,
    usageComponent: ConjunctionElimLeft,
  },
  "∧ER": {
    name: "Right conjunction elimination",
    description: "",
    nrArguments: 1,
    usageComponent: ConjunctionElimRight,
  },
  "∨IL": {
    name: "Left disjunction introduction",
    description: "",
    nrArguments: 1,
    usageComponent: DisjunctionIntroLeft,
  },
  "∨IR": {
    name: "Right disjunction introduction",
    description: "",
    nrArguments: 1,
    usageComponent: DisjunctionIntroRight,
  },
  "∨E": {
    name: "Disjunction elimination",
    description: "",
    nrArguments: 3,
    usageComponent: DisjunctionElim,
  },
  "→I": {
    name: "Implication introduction",
    description: "",
    nrArguments: 1,
    usageComponent: ImplicationIntro,
  },
  "→E": {
    name: "Implication elimination",
    description: "",
    nrArguments: 2,
    usageComponent: ImplicationElim,
  },
  "¬I": {
    name: "Negation introduction",
    description: "",
    nrArguments: 1,
    usageComponent: NegationIntro,
  },
  "¬E": {
    name: "Negation elimination",
    description: "",
    nrArguments: 2,
    usageComponent: NegationElim,
  },
  "⊥E": {
    name: "Contradiction elimination",
    description: "",
    nrArguments: 1,
    usageComponent: ContradictionElim,
  },
  "¬¬I": {
    name: "Double negation introduction",
    description: "",
    nrArguments: 1,
    usageComponent: DoubleNegationIntro,
  },
  "¬¬E": {
    name: "Double negation elimination",
    description: "",
    nrArguments: 1,
    usageComponent: DoubleNegationElim,
  },
  "MT": {
    name: "Modus tollens",
    description: "",
    nrArguments: 2,
    usageComponent: MT,
  },
  "PBC": {
    name: "Proof by contradiction",
    description: "",
    nrArguments: 1,
    usageComponent: PBC,
  },
  "LEM": {
    name: "Law of excluded middle",
    description: "",
    nrArguments: 0,
    usageComponent: LEM,
  },
  "=I": {
    name: "Equality introduction",
    description: "",
    nrArguments: 0,
    usageComponent: EqualityIntro,
  },
  "=E": {
    name: "Equality elimination",
    description: "",
    nrArguments: 3,
    argumentLabels: ["", "", "𝝓(u)≡"],
    argumentInputLengths: [35, 35, 150],
    usageComponent: EqualityElim,
  },
  "∀E": {
    name: "Universal elimination",
    description: "",
    nrArguments: 2,
    usageComponent: UniversalElim,
  },
  "∀I": {
    name: "Universal introduction",
    description: "",
    nrArguments: 1,
    usageComponent: UniversalIntro,
  },
  "∃E": {
    name: "Existential elimination",
    description: "",
    nrArguments: 2,
    usageComponent: ExistentialElim,
  },
  "∃I": {
    name: "Existential introduction",
    description: "",
    nrArguments: 1,
    usageComponent: ExistentialIntro,
  }
};