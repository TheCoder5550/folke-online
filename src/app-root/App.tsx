import ErrorBoundary from '../components/ErrorBoundary'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'

function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />
        <div className="paper-container">
          <div className="paper">
            <h1>Folke Online</h1>
            <p>Folke is an interactive proof editor for propositional and first-order logic.</p>
            <p>
              Go to the <a href="./editor/">editor</a> to write proofs or practice <a href="./exercises/">old exams and exercises</a>.
            </p>
          </div>
        </div>
        <Footer />
      </ErrorBoundary>
    </>
  )
}

export default App
