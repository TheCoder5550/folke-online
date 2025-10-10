---
name: Proof By Contradiction (PBC)
---

# Proof By Contradiction
Use Proof By Contradiction (PBC) to prove the following sequent. Start by assuming the negation of the conclusion i.e. `¬(p ∨ (p → q))`. Then try to reach a contradiction `⊥` and use the rule `PBC` to finally reach the conclusion `p ∨ (p → q)`.

!proof[sequent=|- p | (p -> q)][solution=Using-proof-by-contradiction-1.folke]

<br />
<br />

Proof By Contradiction is not a primitive rule and thus, it can be derived from other rules. Try to prove the following sequent without using the `PBC` rule.

!proof[sequent=¬p → ⊥ |- p][solution=Using-proof-by-contradiction-2.folke]