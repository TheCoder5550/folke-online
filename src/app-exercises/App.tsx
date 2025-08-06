import { useEffect, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import ExerciseList from '../components/ExerciseList/ExerciseList';
import Header from '../components/Header/Header';
import { COMPONENT_MAP as EXAM_COMPONENT_MAP } from '../exercise-components/exam-data';
import { COMPONENT_MAP as EXERCISE_COMPONENT_MAP } from '../exercise-components/exercise-data';
import ContextMenu from '../components/ContextMenu/ContextMenu';
import { IoMdArrowRoundBack } from 'react-icons/io';

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
      <ErrorBoundary>
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
              <CurrentComp />
            ) : (
              <ExerciseList id={id} setId={setId} />
            )}

            {id != null && (
              <button title="Close question" type="button" onClick={() => setId(null)} className="close-button">✕</button>
            )}
          </div>
        </div>
        
        <ContextMenu />
      </ErrorBoundary>
    </>
  )
}

export default App
