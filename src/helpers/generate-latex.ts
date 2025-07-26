import { isStepLine } from "./proof-helper";
import { makeSpecialCharacters } from "./special-characters";

export default function generateLatex(proof: Proof, title?: string): string {
  const section = title == undefined ?
    "" :
    `\\section*{${title}}`

  return `
\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{logicproof}

\\begin{document}
${section}

${formatProof(proof)}

\\end{document}
  `.trim();
}

function formatProof(proof: Proof): string {
  const nestingLevel = 4;

  return `
$${formatSequent(proof)}$

\\begin{logicproof}{${nestingLevel}}
${formatPremises(proof.premises)}
${formatSteps(proof.steps)}
\\end{logicproof}
  `.trim()
}

function formatSequent(proof: Proof): string {
  return formatLatex(`${proof.premises.join(", ")} ${makeSpecialCharacters("=>")} ${proof.conclusion}`)
}

function formatPremises(premises: string[]): string {
  return premises
    .map(p => `${formatLatex(p)} & premise \\\\`)
    .join("\n")
}

function formatSteps(steps: Step[]): string {
  return steps
    .map((step, index) => formatStep(step, index === steps.length - 1))
    .join("\n")
}

function formatStep(step: Step, isLast: boolean): string {
  return isStepLine(step) ?
    formatLine(step, isLast) :
    formatBox(step)
}

function formatLine(step: StepLine, isLast: boolean): string {
  const fStatement = formatLatex(step.statement);
  const fRule = formatRuleName(step.rule);
  const fArguments = formatArguments(step);

  const rhs = `$${fRule}$ ${fArguments}`
  const newLine = isLast ? "" : "\\\\";

  return `${fStatement} & ${rhs} ${newLine}`
}

function formatRuleName(rule: string): string {
  rule = rule.trim();

  if (rule === "∧EL") {
    return "\\land \\mathrm{e}_{1}"
  }
  else if (rule === "∧ER") {
    return "\\land \\mathrm{e}_{2}"
  }
  else if (rule === "∨IL") {
    return "\\lor \\mathrm{i}_{1}"
  }
  else if (rule === "∨IR") {
    return "\\lor \\mathrm{i}_{2}"
  }

  const formatted = formatLatex(rule).trim();
  return formatted
    .split(" ")
    .map((part, index) => {
      if (part.charAt(0) !== "\\") {
        if (index >= 1) {
          part = part.toLowerCase();
        }
        return `\\mathrm{${part}}`
      }

      return part;
    })
    .join(" ");
}

function formatArguments(step: StepLine): string {
  const usedArguments = step.arguments.slice(0, step.usedArguments);
  const fArguments = usedArguments.map(a => formatLatex(a)).join(", ");

  if (usedArguments.length > 1) {
    return `(${fArguments})`
  }

  return fArguments;
}

function formatBox(step: StepBox): string {
  return `
\\begin{subproof}
${formatSteps(step.steps)}
\\end{subproof}
  `.trim()
}

function formatLatex(text: string): string {
  return text
    .replaceAll("¬", "\\neg ")
    .replaceAll("→", "\\rightarrow ")
    .replaceAll("∧", "\\land ")
    .replaceAll("∨", "\\lor ")
    .replaceAll("⊥", "\\bot ")
    .replaceAll("∀", "\\forall ")
    .replaceAll("∃", "\\exists ")
    .replaceAll("⊢", "\\vdash ")

    .replaceAll("₀", "_0")
    .replaceAll("₁", "_1")
    .replaceAll("₂", "_2")
    .replaceAll("₃", "_3")
    .replaceAll("₄", "_4")
    .replaceAll("₅", "_5")
    .replaceAll("₆", "_6")
    .replaceAll("₇", "_7")
    .replaceAll("₈", "_8")
    .replaceAll("₉", "_9")
}