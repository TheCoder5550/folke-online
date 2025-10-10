---
name: Modus Tollens (MT)
order: 6
---

# Modus Tollens
Modus tollens is a rule that is similar to `->E` in that it eliminates an implication. It states that, if we have `p → q` and `¬q`, we can reach to conclusion `¬p`.

Use modus tollens (`MT`) to prove the following sequent.

!proof[sequent=q -> (p -> r); !r; q |- !p][solution=Using-modus-tollens-1.folke]

<br />
<br />

Modus tollens is not a primitive rule and thus, it can be derived from other rules. Try to prove the following sequent without using the `MT` rule.

!proof[sequent=p → q; ¬q |- ¬p][solution=Using-modus-tollens-2.folke]