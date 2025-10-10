# De Morgan's laws
Prove De Morgan's laws.

<br />
<br />

## Negation of conjunction
The negation of conjunction rule states that `¬(P ∧ Q) ↔ (¬P ∨ ¬Q)`. To prove this rule we have to prove both directions in the equivalence.

!proof[sequent=!(P & Q) |- !P | !Q]
!proof[sequent=!P | !Q |- !(P & Q)]

<br />
<br />

## Negation of disjunction
The negation of disjunction rule states that `¬(P ∨ Q) ↔ (¬P ∧ ¬Q)`. Note that the conjunctions and disjunctions are flipped compared to the negation of *conjunction* rule. To prove this rule we have to prove both directions in the equivalence.

!proof[sequent=!(P | Q) |- !P & !Q]
!proof[sequent=!P & !Q |- !(P | Q)]