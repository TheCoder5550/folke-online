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

        <div style={{ display: "flex", flexDirection: "row" }}>
          <ExerciseList index={index} setIndex={setIndex} />
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "1rem", paddingBottom: "1rem", flexGrow: "1" }}>
            <div style={{ position: "relative", padding: "3rem 6rem", border: "1px solid gray", background: "white", width: "100%", maxWidth: "1000px", flexGrow: "1" }}>
              {CurrentComp ? (
                <CurrentComp />
              ) : (
                <>
                  <h1>Exercises</h1>
                  <span>Select a question</span>
                </>
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
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
