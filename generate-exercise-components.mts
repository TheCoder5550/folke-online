import * as fs from 'node:fs/promises';
import * as path from "node:path";

const proofCollection = "./folke/assets/examples/exams";
const outputDir = "./src/exercise-components";

const files = await fs.readdir(proofCollection);
for (const file of files) {
  const content = await fs.readFile(path.join(proofCollection, file),  { encoding: 'utf8' });
  await generateComponent(file, content);
}

await generateMainComponent(files);
await generateList(files);

async function generateComponent(fileName: string, folkeContent: string) {
  const compName = getComponentName(fileName);
  const outFileName = compName + ".tsx";

  const content = `
// AUTO-GENERATED

import PracticeProofRenderer from "../components/PracticeProofRenderer";
import { createExercise } from "../helpers/proof-helper";
import { ProofStoreProvider } from "../stores/proof-store";

const proof: HaskellProof = ${folkeContent};
const premises = proof._sequent._premises;
const conclusion = proof._sequent._conclusion;

export default function ${compName}() {
  return (
    <ProofStoreProvider key="${compName}" localStorageName="${compName}" initialProof={createExercise(premises, conclusion)}>
      <span>${compName}</span>
      <PracticeProofRenderer />
    </ProofStoreProvider>
  )
}
  `.trim();

  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

async function generateMainComponent(fileNames: string[]) {
  const thisCompName = "AllExams";
  const componentNames = fileNames.map(f => getComponentName(f));
  const imports = componentNames.map(c => `import ${c} from "./${c}"`).join("\n");
  const components = componentNames.map(c => `      <${c} />`).join("\n");
  const compList = componentNames.join(",\n");

  const content = `
// AUTO-GENERATED

${imports}

export const COMPONENT_LIST = [
${compList}
]

export default function ${thisCompName}() {
  return (
    <>
${components}
    </>
  )
}
  `.trim();

  const outFileName = thisCompName + ".tsx";
  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

async function generateList(fileNames: string[]) {
  const examNames = fileNames.map(f => `"${f}"`).join(",\n")

  const content = `
// AUTO-GENERATED

export const EXAM_NAMES = [
${examNames}
]
  `.trim();

  const outFileName = "exam-data.ts";
  const data = new Uint8Array(Buffer.from(content));
  await fs.writeFile(path.join(outputDir, outFileName), data);
}

function getComponentName(fileName: string) {
  return toTitleCase(path.basename(fileName, ".folke"));
}

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}