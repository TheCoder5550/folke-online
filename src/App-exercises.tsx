import ErrorBoundary from './components/ErrorBoundary';
import ExamList from './components/ExamList';
import Exercise from './components/Exercise'
import Header from './components/Header';

const exercise1 = (await import(`./assets/exercises-markdown/exercise-1.md?raw`)).default;
const exercise2 = (await import(`./assets/exercises-markdown/exercise-2.md?raw`)).default;

function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "1rem", paddingBottom: "1rem" }}>
          <div style={{ padding: "3rem 6rem", border: "1px solid gray", background: "white", width: "100%", maxWidth: "1000px" }}>
            <ExamList />
            
            {/* <Exercise markdown={exercise1} name="1" key="1" />
            <Exercise markdown={exercise2} name="2" key="2" /> */}
          </div>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
