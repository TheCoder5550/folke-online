import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import ProofRenderer from './components/ProofRenderer'

function App() {
  return (
    <>
      <ErrorBoundary>
        <ProofRenderer />
      </ErrorBoundary>
    </>
  )
}

export default App
