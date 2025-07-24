import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import ProofRenderer from './components/ProofRenderer'

function App() {
  return (
    <>
      <ErrorBoundary>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ProofRenderer />
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
