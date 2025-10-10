---
name: Implication introduction and elimination
order: 3
---

# Implication introduction and elimination
Use the rule for implication elimination (`->E`) to prove the following sequent.
!proof[sequent=p → (q ∧ r); r → s; p |- s][solution=Using-implication-1.folke]

<br />
<br />

Use the rule for implication introduction (`->I`) to prove the following sequent. Start by opening a box. Make an assumption of `p` using the rule `assume` inside the box. Use the rules you've learned so far to reach `s` inside the box. Now, close the box by selecting the last line in the box and pressing `Ctrl+Enter`. This will insert a new line below the box. Use implication introduction (`->I`) to reach the conclusion.
!proof[sequent=p → r; r → s |- p → s][solution=Using-implication-2.folke]