import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import ProofRenderer from './components/ProofRenderer'
import RunWasm from './components/RunWasm'

function App() {
  return (
    <>
      <ErrorBoundary>
        <RunWasm />
        <ProofRenderer />
      </ErrorBoundary>
    </>
  )
}

export default App
