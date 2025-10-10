---
name: Disjunction introduction and elimination
order: 2
---

# Disjunction introduction and elimination
Use the rules for conjunction elimination (`orE`) and introduction (`orIL` and `orIR`) to prove the following sequent. Start by opening a box. Make an assumption of the left side of the disjunction, `p ∧ s`, using the rule `assume` inside the box. Use the rules you've learned so far to reach `s` inside the box.

Now, close the box by selecting the last line in the box and pressing `Ctrl+Enter`. This will insert a new line below the box. Open a second box immediately below the first box. This can be done by selecting the line you just created and pressing `Ctrl+B`. A box will be created around the line. Continue by assuming `r ∧ s` and reach `s` again in this box.

Now you have two boxes that both reach the same conclusion and can therefor use conjunction elimination to show `s` outside the boxes too. Finally use disjunction elimination to reach `s ∨ t`.

!proof[sequent=(p ∧ s) ∨ (r ∧ s) |- s ∨ t][solution=Using-disjunction.folke]