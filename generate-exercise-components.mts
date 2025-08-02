import * as fs from 'node:fs/promises';
import * as path from "node:path";
import { marked, type TokenizerAndRendererExtension } from 'marked';

const proofCollection = "./folke/assets/examples/exams";
const markdownCollection = "./src/assets/exercises-markdown";
const outputDir = "./src/exercise-components";

const allFileNames: string[] = [];

await generateMarkdowns();
await generateExams();

await generateIdList(allFileNames);

async function generateIdList(fileNames: string[]) {
  const ids = fileNames.map(f => `"${f}"`).join(",\n");

  const content = `
// AUTO-GENERATED

export const IDS = [
${ids}
]
  `.trim();

  const outFileName = "id-data.ts";
  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

// #region Generate markdown

async function generateMarkdowns() {
  const proofExt: TokenizerAndRendererExtension = {
    name: 'proof',
    level: 'block',                                     // Is this a block-level or inline-level tokenizer?
    start(src) { return src.match(/!p/)?.index; }, // Hint to Marked.js to stop and check for a match
    tokenizer(src, _tokens) {
      const str = src;
      const regex = /^!proof(?:\[(.+?)=(.+?)\])(?:\[(.+?)=(.+?)\])?/;
      const match = str.match(regex);
      if (match) {
        let sequent = "";
        if (match[1] === "sequent") {
          sequent = match[2];
        }
        else if (match[3] === "sequent") {
          sequent = match[4];
        }

        let solution = "";
        if (match[1] === "solution") {
          solution = match[2];
        }
        else if (match[3] === "solution") {
          solution = match[4];
        }

        const split = sequent.split("|-");
        const premises = split[0].split(";").map(p => p.trim());
        const conclusion = split[1].trim();

        const token = {                                 // Token to generate
          type: 'proof',                                // Should match "name" above
          raw: match[0],                                // Text to consume from the source
          premises,
          conclusion,
          solution
        };
        return token;
      }
    },
    renderer(token) {
      const premises = `[${token.premises.map((p: string) => `"${p}"`).join(",")}]`;
      const conclusion = `"${token.conclusion}"`;
      const solution = token.solution;
      
      return `
<ProofStoreProvider initialProof={createExercise(${premises}, ${conclusion})} localStorageName='$STORAGE_NAME$'>
  <PracticeProofRenderer onValid={() => completeSubExercise(id, $SUB_QUESTION_INDEX$, $TOTAL_SUB_QUESTIONS$)} solution={${solution}} />
</ProofStoreProvider>

      `.trim();
    }
  };

  marked.use({ extensions: [proofExt] });

  let files = await fs.readdir(markdownCollection);
  files = files.filter(file => path.extname(file) === ".md");
  allFileNames.push(...files);
  
  for (const file of files) {
    const content = await fs.readFile(path.join(markdownCollection, file),  { encoding: 'utf8' });
    await generateExerciseFromMarkdown(file, content);
  }

  await generateMarkdownList(files);
}

async function generateExerciseFromMarkdown(fileName: string, fileContent: string) {
  const compName = getMarkdownComponentName(fileName);
  const outFileName = compName + ".tsx";
  const parsedMarkdown = await marked.parse(fileContent);

  let content = `
// AUTO-GENERATED

import PracticeProofRenderer from "../components/PracticeProofRenderer";
import { ProofStoreProvider } from "../stores/proof-store";
import { createExercise, flattenProof, haskellProofToProof } from "../helpers/proof-helper";
import useProgressStore from "../stores/progress-store";

const id = "${fileName}";

export default function ${compName}() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const completeSubExercise = useProgressStore((state) => state.completeSubExercise);

  return (
    <>
${parsedMarkdown}
    </>
  )
}
  `.trim();

  let i = 0;
  while (content.includes("$STORAGE_NAME$")) {
    content = content.replace("$STORAGE_NAME$", compName + "@" + i)
    i++;
  }

  i = 0;
  while (content.includes("$SUB_QUESTION_INDEX$")) {
    content = content.replace("$SUB_QUESTION_INDEX$", i.toString())
    i++;
  }

  content = content.replaceAll("$TOTAL_SUB_QUESTIONS$", i.toString())

  const regex = /solution={(.*)}/g;
  let matches = content.matchAll(regex);
  for (const match of matches) {
    const full = match[0];
    const solution = match[1];
    if (solution == "") {
      content = content.replace(full, "");
      continue;
    }

    const p = path.join(markdownCollection, solution);
    try {
      let solutionContent = await fs.readFile(p,  { encoding: 'utf8' });
      solutionContent = JSON.stringify(JSON.parse(solutionContent));
      content = content.replace(full, `solution={flattenProof(haskellProofToProof(${solutionContent}))}`);
    }
    catch (e) {
      content = content.replace(full, "");
      console.error(`Invalid solution '${solution}'`)
      console.error(e);
    }
  }

  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

async function generateMarkdownList(fileNames: string[]) {
  const componentNames = fileNames.map(f => getMarkdownComponentName(f));
  const imports = componentNames.map(c => `import ${c} from "./${c}"`).join("\n");

  const componentMap = fileNames
    .map(fileName => `"${fileName}": ${getMarkdownComponentName(fileName)}`)
    .join(",\n");

  const content = `
// AUTO-GENERATED

${imports}

export const COMPONENT_MAP = {
${componentMap}
}
  `.trim();

  const outFileName = "exercise-data.ts";
  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

function getMarkdownComponentName(fileName: string) {
  return "Exercise_" +  toTitleCase(path.basename(fileName, ".md").replaceAll("-", "_").replaceAll(" ", "_"));
}

// #endregion

// #region Generate exams

async function generateExams() {
  let files = await fs.readdir(proofCollection);
  files = files.filter(file => path.extname(file) === ".folke");
  allFileNames.push(...files);

  for (const file of files) {
    const content = await fs.readFile(path.join(proofCollection, file),  { encoding: 'utf8' });
    await generateComponent(file, content);
  }

  await generateList(files);
}

async function generateComponent(fileName: string, folkeContent: string) {
  const compName = getComponentName(fileName);
  const outFileName = compName + ".tsx";
  const examName = toTitleCase(fileName.split("_").slice(0, 2).join(" "));
  const questionName = getExamQuestion(fileName);

  const content = `
// AUTO-GENERATED

import PracticeProofRenderer from "../components/PracticeProofRenderer";
import { createExercise, flattenProof, haskellProofToProof } from "../helpers/proof-helper";
import { ProofStoreProvider } from "../stores/proof-store";
import useProgressStore from "../stores/progress-store";

const id = "${fileName}";
const proof: HaskellProof = ${folkeContent};
const flatProof = flattenProof(haskellProofToProof(proof));
const premises = proof._sequent._premises;
const conclusion = proof._sequent._conclusion;

export default function ${compName}() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const completeExercise = useProgressStore((state) => state.completeExercise);

  return (
    <ProofStoreProvider key="${compName}" localStorageName="${compName}" initialProof={createExercise(premises, conclusion)}>
      <h1>${examName}</h1>
      <h3>Question ${questionName}</h3>
      <PracticeProofRenderer solution={flatProof} onValid={() => completeExercise(id)} />
    </ProofStoreProvider>
  )
}
  `.trim();

  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

async function generateList(fileNames: string[]) {
  const componentNames = fileNames.map(f => getComponentName(f));
  const imports = componentNames.map(c => `import ${c} from "./${c}"`).join("\n");

  const examMap = new Map<string, string[]>();
  for (const fileName of fileNames) {
    const examId = fileName.split("_")[1];
    if (!examMap.has(examId)) {
      examMap.set(examId, []);
    }

    const list = examMap.get(examId);
    if (!list) {
      console.error("Error :(")
      continue;
    }

    list.push(fileName);
  }

  const objectEntries = [...examMap.entries()]
    .map(([key, value]) => `"${key}": [${value.map(v => `"${v}"`).join(", ")}]`)
    .join(",\n");

  const componentMap = fileNames
    .map(fileName => `"${fileName}": ${getComponentName(fileName)}`)
    .join(",\n");

  const content = `
// AUTO-GENERATED

${imports}

export const COMPONENT_MAP = {
${componentMap}
}

export const EXAM_CATEGORIES = {
${objectEntries}
}
  `.trim();

  const outFileName = "exam-data.ts";
  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

function getComponentName(fileName: string) {
  return "Exam_" + toTitleCase(path.basename(fileName, ".folke").replaceAll("-", "_"));
}

function getExamQuestion(fileName: string) {
  const removeExt = path.basename(fileName, ".folke");
  const parts = removeExt.split("_").slice(2);
  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} (${parts.slice(1).join(" ")})`
}

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

// #endregion