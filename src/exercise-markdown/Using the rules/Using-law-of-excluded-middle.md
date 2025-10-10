---
name: Law of Excluded Middle (LEM)
---

# Law of Excluded Middle
Use the Law of Excluded Middle (LEM) to prove the following sequent. Start by stating `p ∨ ¬p` using the rule `LEM` and finish the proof with disjunction elimination using the rule `orE`.

!proof[sequent=!p -> s |- s | p][solution=Using-law-of-excluded-middle-1.folke]

<br />
<br />

The law of excluded middle is not a primitive rule and thus, it can be derived from other rules. Try to prove the following sequent without using the `LEM` rule.

!proof[sequent=|- p | !p][solution=Using-law-of-excluded-middle-2.folke]