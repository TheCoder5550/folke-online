---
name: Getting started
order: 0
---

# Getting started
Some basic exercises to help you learn the syntax and how to use the proof editor.

View available rules, keyboard and symbol shortcuts on the [Guide](../guide/) page.

<br />

## Using the editor
Prove `A, B |- A & B`. Start by pressing `+ New line` and type `A & B` in the first text field. & is automatically converted to ∧. Use the `∧I` rule by typing `&I` into the second field. Specify that the rule uses line 1 and 2 by typing 1 into the first field and 2 into the second.
!proof[sequent=A; B |- A & B][solution=getting-started-1.folke]

<br />

## Writing a longer proof
Start by creating an empty row and use `∧EL` to get A. Insert another row below by pressing `Enter`, right-clicking the row or using the buttons next to the row. Use `∧ER` on this row to get D. Add the final row and complete the proof using `∧I`.

**Stuck?** Press the *light bulb* to peek at the complete proof.
!proof[sequent=A & B; C & D |- A & D][solution=getting-started-2.folke]

<br />

## Creating a box
Prove the sequent `P & Q |- P -> Q`. To be able to use the `→I` rule, you first have to create a box. Add an empty row and press the box icon next to it or press `Ctrl+B` to add a box around the row. First assume P and then use `∧ER` to get Q. Add a row below the box by pressing `Ctrl+Enter`. Use the →I rule and type `2-3` as the box.
!proof[sequent=P & Q |- P -> Q][solution=getting-started-3.folke]