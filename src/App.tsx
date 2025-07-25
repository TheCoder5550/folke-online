import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import PracticeProofRenderer from './components/PracticeProofRenderer'
import ProofRenderer from './components/ProofRenderer'
import { createExercise } from './helpers/proof-helper'
import { ProofStoreProvider } from './stores/proof-store'

function App() {
  return (
    <>
      <ErrorBoundary>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* <ProofStoreProvider localStorageName='current-proof-storage'>
            <ProofRenderer />
          </ProofStoreProvider>

          <ProofStoreProvider initialProof={createExercise(["A", "B"], "A & B")} localStorageName='exercise-1'>
            <PracticeProofRenderer />
          </ProofStoreProvider> */}

          <ProofStoreProvider initialProof={createExercise(["P -> !P"], "!P")} localStorageName='exercise-2'>
            <PracticeProofRenderer />
          </ProofStoreProvider>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
