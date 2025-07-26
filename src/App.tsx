import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import Exercise from './components/Exercise'
import PracticeProofRenderer from './components/PracticeProofRenderer'
import ProofRenderer from './components/ProofRenderer'
import { createExercise } from './helpers/proof-helper'
import { ProofStoreProvider } from './stores/proof-store'

const markdownFileContent = (await import(`./exercises/exercise-1.md?raw`)).default;

function App() {
  return (
    <>
      <ErrorBoundary>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* <Exercise markdown={markdownFileContent} /> */}

          <ProofStoreProvider localStorageName='current-proof-storage'>
            <ProofRenderer />
          </ProofStoreProvider>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
