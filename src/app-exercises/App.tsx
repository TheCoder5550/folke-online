import { useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import ExerciseList from '../components/ExerciseList/ExerciseList';
import Header from '../components/Header/Header';
import { COMPONENT_LIST as EXAM_COMPONENT_LIST } from '../exercise-components/AllExams';
import { COMPONENT_LIST as EXERCISE_COMPONENT_LIST } from '../exercise-components/exercise-data';

const ALL_COMPONENTS = [
  ...EXERCISE_COMPONENT_LIST,
  ...EXAM_COMPONENT_LIST,
]

function App() {
  const [index, setIndex] = useState<number | null>(null);
  const CurrentComp = index != null ?  ALL_COMPONENTS[index] : null;

  return (
    <>
      <ErrorBoundary>
        <Header />

        <div className="paper-container">
          <div className="paper">
            {CurrentComp ? (
              <CurrentComp />
            ) : (
              <ExerciseList index={index} setIndex={setIndex} />
            )}

            {index != null && (
              <button type="button" onClick={() => setIndex(null)} style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
              }}>Close</button>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
