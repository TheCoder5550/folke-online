import styles from "./App.module.css";
import { useEffect, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import ExerciseList from '../components/ExerciseList/ExerciseList';
import Header from '../components/Header/Header';
import { EXAM_CATEGORIES, COMPONENT_MAP as EXAM_COMPONENT_MAP } from '../exercise-components/exam-data';
import { COMPONENT_MAP as EXERCISE_COMPONENT_MAP } from '../exercise-components/exercise-data';
import ContextMenu from '../components/ContextMenu/ContextMenu';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { WasmProvider } from '../helpers/wasm-provider';
import PracticeRuleDictionary from '../components/RuleDictionary/PracticeRuleDictionary';
import ToggleButton from '../components/ToggleButton/ToggleButton';
import { FaBook } from 'react-icons/fa';
import { RiCharacterRecognitionFill } from 'react-icons/ri';
import SymbolDictionary from '../components/SymbolDictionary/SymbolDictionary';
import Footer from "../components/Footer/Footer";
import { IDS, NAMES } from "../exercise-components/id-data";

const ALL_COMPONENTS = {
  ...EXAM_COMPONENT_MAP,
  ...EXERCISE_COMPONENT_MAP
}

function getComponentById(id: string | null) {
  if (id == null) {
    return null;
  }

  if (ALL_COMPONENTS.hasOwnProperty(id)) {
    return ALL_COMPONENTS[id as keyof typeof ALL_COMPONENTS];
  }

  return null;
}

function App() {
  const params = new URL(window.location.href).searchParams;

  const [id, setId] = useState<string | null>(params.get("exercise"));
  const CurrentComp = getComponentById(id);

  const [viewRules, setViewRules] = useState(false);
  const [viewSymbols, setViewSymbols] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const state = event.state as {id: string | null} | null;
      const id = state === null ? null : state.id as string;
      setId(id);
    }

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    }
  }, []);

  useEffect(() => {
    if (id === null) {
      document.title = "Folke Online - Exercises";
    }
    else {
      const name = NAMES[IDS.indexOf(id)];
      const exam = Object.entries(EXAM_CATEGORIES).find(([_, questions]) => {
        return questions.find(q => q === id)
      });
      if (exam) {
        document.title = `Folke Online - ${exam[0]} ${name}`;
      }
      else {
        document.title = "Folke Online - " + name;
      }
    }
  }, [id]);

  const openExercise = (id: string | null) => {
    const stateObj = { id };
    const url = id === null ? "./" : "?exercise=" + id;
    history.pushState(stateObj, "", url);

    setId(id);
  }

  return (
    <>
      <ErrorBoundary>
        <WasmProvider>
          <Header />

          <div className="paper-container">
            <div className="paper invisible">
              {id != null && (
                <button title="Go back to exercise list" type="button" onClick={() => openExercise(null)} className={styles["secondary-button"]}>
                  <IoMdArrowRoundBack />
                  Back to list
                </button>
              )}

              {CurrentComp ? (
                <>
                  <CurrentComp />

                  <div style={{ display: "flex", gap: "0.5rem", position: "fixed", bottom: "0", padding: "0.5rem 0", background: "rgb(var(--background-rgb))", zIndex: "10" }}>
                    <span>Tools: </span>

                    <ToggleButton title="Show all rules" toggle={() => setViewRules(!viewRules)} toggled={viewRules} style={{ fontSize: "0.75rem" }}>
                      <FaBook /> View rules
                    </ToggleButton>

                    <ToggleButton title="Show symbol keypad" toggle={() => setViewSymbols(!viewSymbols)} toggled={viewSymbols} style={{ fontSize: "0.75rem" }}>
                      <RiCharacterRecognitionFill /> View symbols
                    </ToggleButton>
                  </div>

                  <div className={styles["tool-grid"]}>
                    {viewRules && (
                      <div>
                        <h2>Rules</h2>
                        <PracticeRuleDictionary />
                      </div>
                    )}

                    {viewSymbols && (
                      <div>
                        <h2>Symbols</h2>
                        <SymbolDictionary />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <ExerciseList id={id} setId={openExercise} />
              )}

              {id != null && (
                <button title="Close question" type="button" onClick={() => openExercise(null)} className="close-button">✕</button>
              )}
            </div>
          </div>

          <Footer />
          
          <ContextMenu />
        </WasmProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
