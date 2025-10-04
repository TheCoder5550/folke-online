import "./App.module.css";
import ErrorBoundary from '../components/ErrorBoundary'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'

function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />
        <div className="paper-container" style={{
          padding: "0",
          flexGrow: "1",
        }}>
          <div className="paper" style={{
            margin: "0",
            padding: "2rem",
          }}>
            <h1>Folke Online</h1>
            <p>Folke is an interactive proof editor for propositional and first-order logic. It is based on the course <a href="https://www.chalmers.se/en/education/your-studies/find-course-and-programme-syllabi/course-syllabus/DAT060/">DAT060 Logic in computer science</a> on Chalmers.</p>
            <h2>Get started</h2>
            <p>Read the <a href="./guide/">guide</a> to help you get started.</p>
            <p>Go to the <a href="./editor/">editor</a> to write your own proofs.</p>
            <p>Practice <a href="./exercises/">old exams and exercises</a>.</p>
          </div>
        </div>
        <Footer />
      </ErrorBoundary>
    </>
  )
}

export default App
