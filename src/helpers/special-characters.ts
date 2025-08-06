export function makeSpecialCharacters(text: string) {
  for (const [key, value] of characterLookupTable) {
    text = text.replaceAll(key, value);
  }
  return text;
}

export function getSpecialCharacterAliases(char: string): string[] {
  return characterLookupTable
    .filter(([_alias, spec]) => spec === char)
    .map(([alias, _spec]) => alias);
}

export const SYMBOLS = [
  { symbol: "¬", title: "Negation" },
  { symbol: "→", title: "Implication" },
  { symbol: "∧", title: "Conjunction" },
  { symbol: "∨", title: "Disjunction" },
  { symbol: "⊥", title: "Contradiction" },
  { symbol: "∀", title: "Universal quantifier" },
  { symbol: "∃", title: "Existential quantifier" },
];

const characterLookupTable = [
  // Negate
  ["!", "¬"],
  ["~", "¬"],
  ["not", "¬"],

  // Implies
  [">", "→"],
  ["->", "→"],
  ["¬>", "→"], // Fix for when "-" becomes negation

  // And
  ["/\\", "∧"],
  ["&", "∧"],
  ["^", "∧"],
  ["*", "∧"],
  ["and", "∧"],
  ["con", "∧"],

  // Or
  ["\\/", "∨"],
  ["|", "∨"],
  //["v", "∨"],
  ["+", "∨"],
  ["f∨", "for"], // Disable `or` replacement when writing forall
  ["or", "∨"],
  ["dis", "∨"],

  // Bottom
  ["bot", "⊥"],
  ["#", "⊥"],
  ["XX", "⊥"],

  // For all
  ["all", "∀"],
  ["forall", "∀"],
  // ["A", "∀"],

  // There exists
  ["exists", "∃"],
  ["some", "∃"],
  // ["E", "∃"],

  // Sequent
  ["=/>", "⊬"],
  ["=>", "⊢"],

  // Subscript
  ["_0", "₀"],
  ["_1", "₁"],
  ["_2", "₂"],
  ["_3", "₃"],
  ["_4", "₄"],
  ["_5", "₅"],
  ["_6", "₆"],
  ["_7", "₇"],
  ["_8", "₈"],
  ["_9", "₉"]
].reverse();