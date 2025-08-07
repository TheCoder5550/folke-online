import { useEffect, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import ExerciseList from '../components/ExerciseList/ExerciseList';
import Header from '../components/Header/Header';
import { COMPONENT_MAP as EXAM_COMPONENT_MAP } from '../exercise-components/exam-data';
import { COMPONENT_MAP as EXERCISE_COMPONENT_MAP } from '../exercise-components/exercise-data';
import ContextMenu from '../components/ContextMenu/ContextMenu';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { WasmProvider } from '../helpers/wasm-provider';
import PracticeRuleDictionary from '../components/RuleDictionary/PracticeRuleDictionary';
import ToggleButton from '../components/ToggleButton/ToggleButton';
import { FaBook } from 'react-icons/fa';
import { RiCharacterRecognitionFill } from 'react-icons/ri';
import SymbolDictionary from '../components/SymbolDictionary/SymbolDictionary';

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
  const [id, setId] = useState<string | null>(null);
  const CurrentComp = getComponentById(id);

  const [viewRules, setViewRules] = useState(false);
  const [viewSymbols, setViewSymbols] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
      <ErrorBoundary>
        <WasmProvider>
          <Header />

          <div className="paper-container">
            <div className="paper invisible">
              {id != null && (
                <button title="Go back to exercise list" type="button" onClick={() => setId(null)} style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  padding: "1rem 0",
                  fontSize: "1rem",
                }}>
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

                  <div style={{
                    display: "flex",
                    gap: "2rem",
                    marginTop: "2rem"
                  }}>
                    {viewRules && (
                      <div style={{width: "50%"}}>
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
                <ExerciseList id={id} setId={setId} />
              )}

              {id != null && (
                <button title="Close question" type="button" onClick={() => setId(null)} className="close-button">✕</button>
              )}
            </div>
          </div>
          
          <ContextMenu />
        </WasmProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
