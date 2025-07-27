import PracticeProofRenderer from "./PracticeProofRenderer";
import { ProofStoreProvider } from "../stores/proof-store";
import { createExercise } from "../helpers/proof-helper";
import Markdown from "markdown-to-jsx";

interface ExerciseProps {
  markdown: string;
  name: string;
}

export default function Exercise(props: ExerciseProps) {
  // const proofExt: TokenizerAndRendererExtension<JSX.Element, JSX.Element> = {
  //   name: 'proof',
  //   level: 'block',                                     // Is this a block-level or inline-level tokenizer?
  //   start(src) { return src.match(/!p/)?.index; }, // Hint to Marked.js to stop and check for a match
  //   tokenizer(src, tokens) {
  //     const str = src;
  //     const regex = /^!proof(?:\[(.+?)=(.+?)\])(?:\[(.+?)=(.+?)\])?/;
  //     const match = str.match(regex);
  //     if (match) {
  //       let sequent = "";
  //       if (match[1] === "sequent") {
  //         sequent = match[2];
  //       }
  //       else if (match[3] === "sequent") {
  //         sequent = match[4];
  //       }

  //       const split = sequent.split("=>");
  //       const premises = split[0].split(";").map(p => p.trim());
  //       const conclusion = split[1].trim();

  //       const token = {                                 // Token to generate
  //         type: 'proof',                                // Should match "name" above
  //         raw: match[0],                                // Text to consume from the source
  //         premises,
  //         conclusion
  //       };
  //       return token;
  //     }
  //   },
  //   renderer(token) {
  //     return (
  //       <ProofStoreProvider initialProof={createExercise(token.premises, token.conclusion)} localStorageName='exercise-md'>
  //         <PracticeProofRenderer />
  //       </ProofStoreProvider>
  //     )
  //   }
  // };

  // marked.use({ extensions: [proofExt] });
  // const parsed = marked.parse(props.markdown);

  let index = 0;

  return (
    <div>
      <Markdown
        children={props.markdown}
        options={{
          overrides: {
            Proof: {
              component: (currentProps: ProofCompProps) => {
                index++;
                return ProofComp({...currentProps, name: "exercise-md-" + props.name + "-index:" + index.toString()});
              },
            },
          },
        }}
      />
    </div>
  )
}

interface ProofCompProps {
  name: string;
  sequent?: string;
  solution?: string;
}

function ProofComp(props: ProofCompProps) {
  if (props.sequent == undefined) {
    return <span>No sequent provided</span>
  }

  const split = props.sequent.split("|-");
  if (split.length !== 2) {
    return <span>Invalid sequent</span>
  }

  const premises = split[0]
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .split(";")
    .map(p => p.trim());
  const conclusion = split[1].trim();

  return (
    <ProofStoreProvider initialProof={createExercise(premises, conclusion)} localStorageName={props.name}>
      <PracticeProofRenderer />
    </ProofStoreProvider>
  )
}