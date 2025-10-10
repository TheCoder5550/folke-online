import * as fs from 'node:fs/promises';
import * as path from "node:path";
import { marked, type TokenizerAndRendererExtension } from 'marked';
import type { PathLike } from 'node:fs';

const proofCollection = "./folke/assets/examples/exams";
const markdownCollection = "./src/exercise-markdown";
const outputDir = "./src/exercise-components";

const exercises: Record<string, string[]> = {};
const allFileNames: string[] = [];
const nameOverride: Record<string, string> = {};
const orderOverride: Record<string, number> = {};

await generateMarkdowns();
await generateExams();

await generateIdList();

async function generateIdList() {
  const fileNames = [
    ...Object.values(exercises).flat(),
    ...allFileNames,
  ]

  const imports = fileNames
    .map(f => getComponentName(f))
    .map(c => `import ${c} from "./${c}"`).join("\n");

  const components = fileNames.map(f => `${getComponentName(f)}`).join(",\n");
  const ids = fileNames.map(f => `"${f}"`).join(",\n");
  const names = fileNames.map(f => `"${getExerciseName(f)}"`).join(",\n");

  const content = `
// AUTO-GENERATED

${imports}

export const COMPONENTS = [
${components}
]

export const IDS = [
${ids}
]

export const NAMES = [
${names}
]
  `.trim();

  const outFileName = "id-data.ts";
  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

// #region Generate markdown

async function generateMarkdowns() {
  useMarkdownProofExtension();

  const dirs = await listDirectories(markdownCollection);
  for (const dir of dirs) {
    let files = await fs.readdir(path.join(markdownCollection, dir));
    files = files.filter(file => path.extname(file) === ".md");
    exercises[dir] = files;

    for (const file of files) {
      const content = await fs.readFile(path.join(markdownCollection, dir, file), { encoding: 'utf8' });
      await generateExerciseFromMarkdown(path.join(markdownCollection, dir), file, content);
    }
  }

  await generateMarkdownList(exercises);
}

async function generateExerciseFromMarkdown(workdir: string, fileName: string, fileContent: string) {
  const compName = getComponentName(fileName);
  const outFileName = compName + ".tsx";

  // Remove front matter
  const frontMatter: Record<string, string> = {};
  fileContent = parseFrontMatter(fileContent, frontMatter);

  // Use name specified in markdown file
  if ("name" in frontMatter) {
    nameOverride[fileName] = frontMatter["name"];
  }

  if ("order" in frontMatter) {
    const order = parseInt(frontMatter["order"]);
    if (isNaN(order)) {
      throw new Error("Invalid 'order' in front matter: " + frontMatter["order"]);
    }
    orderOverride[fileName] = order;
  }

  // Parse markdown
  const parsedMarkdown = await marked.parse(fileContent);

  let content = `
// AUTO-GENERATED

import PracticeProofRenderer from "../components/PracticeProofRenderer";
import { ProofStoreProvider } from "../stores/proof-store";
import { createExercise } from "../helpers/proof-helper";
//$FLATTEN_PROOF_IMPORTS$
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

    const p = path.join(workdir, solution);
    try {
      let solutionContent = await fs.readFile(p, { encoding: 'utf8' });
      solutionContent = JSON.stringify(JSON.parse(solutionContent));
      content = content.replace(full, `solution={flattenProof(haskellProofToProof(${solutionContent}))}`);
      content = content.replace("//$FLATTEN_PROOF_IMPORTS$", "import { flattenProof, haskellProofToProof } from \"../helpers/proof-helper\";");
    }
    catch (e) {
      content = content.replace(full, "");
      console.error(`Invalid solution '${solution}'`)
      console.error(e);
    }
  }

  content = content.replace("//$FLATTEN_PROOF_IMPORTS$", "");

  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

async function generateMarkdownList(exercises: Record<string, string[]>) {
  // Take order into account
  for (const [_key, value] of Object.entries(exercises)) {
    value.sort((a, b) => (orderOverride[a] ?? Infinity) - (orderOverride[b] ?? Infinity))
  }

  const imports = Object
    .values(exercises)
    .flat()
    .map(f => getComponentName(f))
    .map(c => `import ${c} from "./${c}"`).join("\n");

  const categoriesMap = Object.entries(exercises)
    .map(([key, value]) => `"${key}": \{${value.map(v => `"${v}": ${getComponentName(v)}`).join(", ")}\}`)
    .join(",\n");

  const content = `
// AUTO-GENERATED

${imports}

export const EXERCISE_CATEGORIES = {
${categoriesMap}
}
  `.trim();

  const outFileName = "exercise-data.ts";
  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

function useMarkdownProofExtension() {
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
        if (split.length !== 2) {
          console.log(match, sequent, solution);
          throw new Error("Invalid sequent: " + sequent);
        }
        const premises = split[0]
          .split(";")
          .map(p => p.trim())
          .filter(p => p !== "");
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
}

async function listDirectories(source: PathLike) {
  return (await fs.readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
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

function getExamQuestion(fileName: string) {
  const removeExt = path.basename(fileName, ".folke");
  const parts = removeExt.split("_").slice(2);
  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} (${parts.slice(1).join(" ")})`
}

// #endregion

function getExerciseName(fileName: string): string {
  if (fileName in nameOverride) {
    return nameOverride[fileName];
  }

  if (path.extname(fileName) === ".md") {
    const n = path.basename(fileName, ".md")
      .replaceAll("-", " ")
      .replaceAll("_", " ");
    return toTitleCase(n);
  }
  else if (path.extname(fileName) === ".folke") {
    return "Question " + getExamQuestion(fileName);
  }

  return fileName;
}

function getComponentName(fileName: string): string {
  const ext = path.extname(fileName);
  if (ext === ".md") {
    return "Exercise_" +  toTitleCase(path.basename(fileName, ".md").replaceAll("-", "_").replaceAll(" ", "_"));
  }
  if (ext === ".folke") {
    return "Exam_" + toTitleCase(path.basename(fileName, ".folke").replaceAll("-", "_"));
  }

  throw new Error("Unknown file ext: " + ext);
}

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

function parseFrontMatter(content: string, frontMatter: Record<string, string>): string {
  const regionRegex = /---\n(.*)\n---/s;
  const region = content.match(regionRegex);
  if (!region || !region[1]) {
    return content;
  }

  const lines = region[1].split("\n");
  for (const line of lines) {
    const parts = line.match(/(\w*):(.*)/);
    if (!parts) {
      continue;
    }

    const key = parts[1].trim();
    const value = parts[2].trim();

    frontMatter[key] = value;
  }

  return content.replace(regionRegex, "");
}