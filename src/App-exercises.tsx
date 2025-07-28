import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import ExamList from './components/ExamList';
import Exercise from './components/Exercise'
import Header from './components/Header';
import { COMPONENT_LIST } from './exercise-components/AllExams';

const exercise1 = (await import(`./assets/exercises-markdown/exercise-1.md?raw`)).default;
const exercise2 = (await import(`./assets/exercises-markdown/exercise-2.md?raw`)).default;

function App() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <ErrorBoundary>
        <Header />

        <div style={{ display: "flex", flexDirection: "row" }}>
          <ExamList index={index} setIndex={setIndex} />
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "1rem", paddingBottom: "1rem", flexGrow: "1" }}>
            <div style={{ padding: "3rem 6rem", border: "1px solid gray", background: "white", width: "100%", maxWidth: "1000px", flexGrow: "1" }}>
              <h1>Exam Question</h1>

              {index != null ? (
                COMPONENT_LIST[index]()
              ) : (
                <span>Select a question</span>
              )}

              {/* <Exercise markdown={exercise1} name="1" key="1" />
              <Exercise markdown={exercise2} name="2" key="2" /> */}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
