import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import ProofRenderer from './components/ProofRenderer'
import RunWasm from './components/RunWasm'
import { ProofProvider } from './helpers/ProofContext'

function App() {
  return (
    <>
      <ErrorBoundary>
        <ProofProvider>
          <RunWasm />
          <ProofRenderer />
        </ProofProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
