import styles from "./App.module.css";
import { useEffect, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import ExerciseList from '../components/ExerciseList/ExerciseList';
import Header from '../components/Header/Header';
import { EXAM_CATEGORIES } from '../exercise-components/exam-data';
import { COMPONENTS, IDS, NAMES } from "../exercise-components/id-data";
import ContextMenu from '../components/ContextMenu/ContextMenu';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { WasmProvider } from '../helpers/wasm-provider';
import Footer from "../components/Footer/Footer";
import ToolbarFooter from "../components/ToolbarFooter/ToolbarFooter";

function getComponentById(id: string | null) {
  if (id == null) {
    return null;
  }

  const index = IDS.indexOf(id);
  if (index === -1) {
    return null;
  }

  return COMPONENTS[index];
}

function App() {
  const params = new URL(window.location.href).searchParams;

  const [id, setId] = useState<string | null>(params.get("exercise"));
  const CurrentComp = getComponentById(id);

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

          <div className="paper-container" style={{
            paddingBottom: CurrentComp ? undefined : "8rem",
          }}>
            <div className="paper invisible">
              {CurrentComp && (
                <>
                  <button
                    type="button"
                    title="Go back to exercise list"
                    onClick={() => openExercise(null)}
                    className={styles["secondary-button"]}
                  >
                    <IoMdArrowRoundBack />
                    Back to list
                  </button>
                  <br />
                </>
              )}

              {CurrentComp ? (
                <CurrentComp />
              ) : (
                <ExerciseList id={id} setId={openExercise} />
              )}

              {CurrentComp && (
                <button
                  type="button"
                  title="Close question"
                  onClick={() => openExercise(null)}
                  className="close-button"
                  style={{
                    top: "0",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {CurrentComp && (
            <ToolbarFooter />
          )}

          <Footer />
          
          <ContextMenu />
        </WasmProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
