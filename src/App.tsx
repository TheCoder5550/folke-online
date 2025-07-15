import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import ProofRenderer from './components/ProofRenderer'
import { ProofProvider } from './helpers/ProofContext'

function App() {
  return (
    <>
      <ErrorBoundary>
        <ProofProvider>
          <ProofRenderer />
        </ProofProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
