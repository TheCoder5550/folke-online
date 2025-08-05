import { useEffect, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import ExerciseList from '../components/ExerciseList/ExerciseList';
import Header from '../components/Header/Header';
import { COMPONENT_MAP as EXAM_COMPONENT_MAP } from '../exercise-components/exam-data';
import { COMPONENT_MAP as EXERCISE_COMPONENT_MAP } from '../exercise-components/exercise-data';
import ContextMenu from '../components/ContextMenu/ContextMenu';

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
          <div className="paper">
            {CurrentComp ? (
              <CurrentComp />
            ) : (
              <ExerciseList id={id} setId={setId} />
            )}

            {id != null && (
              <button type="button" onClick={() => setId(null)} style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
              }}>Close</button>
            )}
          </div>
        </div>
        
        <ContextMenu />
      </ErrorBoundary>
    </>
  )
}

export default App
