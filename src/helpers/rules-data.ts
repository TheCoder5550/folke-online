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
import EqualityElim, { EqualityElimExample } from "../components/RuleDictionary/EqualityElim";
import UniversalElim from "../components/RuleDictionary/UniversalElim";
import UniversalIntro from "../components/RuleDictionary/UniversalIntro";
import ExistentialElim from "../components/RuleDictionary/ExistentialElim";
import ExistentialIntro from "../components/RuleDictionary/ExistentialIntro";
import Premise from "../components/RuleDictionary/Premise";

export interface RuleMetaData {
  name: string;
  description: string;
  nrArguments: number;
  argumentLabels?: string[];
  argumentInputLengths?: number[];
  argumentPlaceholders?: string[];
  usageComponent?: () => JSX.Element;
  exampleComponents?: (() => JSX.Element)[];
}

export const RULE_META_DATA: { [id: string]: RuleMetaData | undefined } = {
  "premise": {
    name: "Premise",
    description: "Premises are automatically added to the beginning of proofs.",
    nrArguments: 0,
    usageComponent: Premise,
  },
  "assume": {
    name: "Assumption",
    description: "Assumptions can only be made inside boxes and are only valid inside that box.",
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
    description: "Reiterate something that is already known. This is required when we want to conclude a box with a formula that has already appeared earlier in the proof.",
    nrArguments: 1,
    argumentPlaceholders: ["Row"],
    usageComponent: Copy,
  },
  "∧I": {
    name: "Conjunction introduction",
    description: "If we know p and we know q, we must also know p ∧ q.",
    nrArguments: 2,
    argumentPlaceholders: ["Row", "Row"],
    usageComponent: ConjunctionIntro,
  },
  "∧EL": {
    name: "Left conjunction elimination",
    description: "If we know p ∧ q, we certainly know both p and q. This rule gives us the left side of the conjunction: p. This rule is more commonly refered to as ∧e1 in litterature.",
    nrArguments: 1,
    argumentPlaceholders: ["Row"],
    usageComponent: ConjunctionElimLeft,
  },
  "∧ER": {
    name: "Right conjunction elimination",
    description: "If we know p ∧ q, we certainly know both p and q. This rule gives us the right side of the conjunction: q. This rule is more commonly refered to as ∧e2 in litterature.",
    nrArguments: 1,
    argumentPlaceholders: ["Row"],
    usageComponent: ConjunctionElimRight,
  },
  "∨IL": {
    name: "Left disjunction introduction",
    description: "If we know p we can infer that q ∨ p holds, for any q, as we know that p already holds. This rule is more commonly refered to as ∨i2 in litterature.",
    nrArguments: 1,
    argumentPlaceholders: ["Row"],
    usageComponent: DisjunctionIntroLeft,
  },
  "∨IR": {
    name: "Right disjunction introduction",
    description: "If we know p we can infer that p ∨ q holds, for any q, as we know that p already holds. This rule is more commonly refered to as ∨i1 in litterature.",
    nrArguments: 1,
    argumentPlaceholders: ["Row"],
    usageComponent: DisjunctionIntroRight,
  },
  "∨E": {
    name: "Disjunction elimination",
    description: "To eliminate disjunction we have to show that we can reach the same conclusion if either the left side or right side of the disjunction holds.",
    nrArguments: 3,
    argumentPlaceholders: ["Row", "Box", "Box"],
    usageComponent: DisjunctionElim,
  },
  "→I": {
    name: "Implication introduction",
    description: "If we make an assumption that p holds and can create a proof for q, we know that if p hold, so does q. We can therefor get the implication p → q.",
    nrArguments: 1,
    argumentPlaceholders: ["Box"],
    usageComponent: ImplicationIntro,
  },
  "→E": {
    name: "Implication elimination",
    description: "We know that, if p holds, so does q and we also know that p holds. Then we can conclude that q must hold too.",
    nrArguments: 2,
    argumentPlaceholders: ["Row", "Row"],
    usageComponent: ImplicationElim,
  },
  "¬I": {
    name: "Negation introduction",
    description: "If we make an assumption that some statement p holds but reach a contradiction, we know that p can not hold. If p doesn't hold we know that ¬p must hold. This rule is similar to implication introduction as we could conclude p → ⊥ from the same box. p → ⊥ is the same as stating ¬p.",
    nrArguments: 1,
    argumentPlaceholders: ["Box"],
    usageComponent: NegationIntro,
  },
  "¬E": {
    name: "Negation elimination",
    description: "We know that both p and its negation ¬p can't both hold. If we have that both hold at the same time, we have a contradiction.",
    nrArguments: 2,
    argumentPlaceholders: ["Row", "Row"],
    usageComponent: NegationElim,
  },
  "⊥E": {
    name: "Contradiction elimination",
    description: "From contradiction we can prove anything.",
    nrArguments: 1,
    argumentPlaceholders: ["Row"],
    usageComponent: ContradictionElim,
  },
  "¬¬I": {
    name: "Double negation introduction",
    description: "Intuitively the double negation of p is the same as p. Use this rule to introduce a double negation of p.",
    nrArguments: 1,
    argumentPlaceholders: ["Row"],
    usageComponent: DoubleNegationIntro,
  },
  "¬¬E": {
    name: "Double negation elimination",
    description: "Intuitively the double negation of p is the same as p. Use this rule to eliminate a double negation of p.",
    nrArguments: 1,
    argumentPlaceholders: ["Row"],
    usageComponent: DoubleNegationElim,
  },
  "MT": {
    name: "Modus tollens",
    description: "Modus tollens (MT) is a rule that is similar to implication elimination in that it eliminates an implication. It states that, if we have p → q and ¬q, we can reach to conclusion ¬p. Modus tollens is not a primitive rule and thus, it can be derived from other rules.",
    nrArguments: 2,
    argumentPlaceholders: ["Row", "Row"],
    usageComponent: MT,
  },
  "PBC": {
    name: "Proof by contradiction",
    description: "Proof by contradiction (PBC) is like negation introduction. If we assume that the negation of p holds and reach a contradiction, we know that p must hold. PBC is not a primitive rule and thus, it can be derived from other rules.",
    nrArguments: 1,
    argumentPlaceholders: ["Box"],
    usageComponent: PBC,
  },
  "LEM": {
    name: "Law of excluded middle",
    description: "We know that exactly one of p and ¬p must hold at any time. Thus, we can conclude that p ∨ ¬p always holds. The law of excluded middle (LEM) is not a primitive rule and thus, it can be derived from other rules.",
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
    argumentLabels: ["", "", "𝝓(x)≡"],
    argumentInputLengths: [35, 35, 150],
    argumentPlaceholders: ["Row", "Row", "Sub. func."],
    usageComponent: EqualityElim,
    exampleComponents: [ EqualityElimExample ],
  },
  "∀I": {
    name: "Universal introduction",
    description: "",
    nrArguments: 1,
    argumentPlaceholders: ["Box"],
    usageComponent: UniversalIntro,
  },
  "∀E": {
    name: "Universal elimination",
    description: "",
    nrArguments: 2,
    argumentPlaceholders: ["Row", "Var."],
    usageComponent: UniversalElim,
  },
  "∃I": {
    name: "Existential introduction",
    description: "",
    nrArguments: 1,
    argumentPlaceholders: ["Row"],
    usageComponent: ExistentialIntro,
  },
  "∃E": {
    name: "Existential elimination",
    description: "",
    nrArguments: 2,
    argumentPlaceholders: ["Row", "Box"],
    usageComponent: ExistentialElim,
  },
};