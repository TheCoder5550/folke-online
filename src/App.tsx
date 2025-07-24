import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import ProofRenderer from './components/ProofRenderer'
import { ProofStoreProvider } from './stores/proof-store'

function App() {
  return (
    <>
      <ErrorBoundary>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ProofStoreProvider localStorageName='current-proof-storage'>
            <ProofRenderer />
          </ProofStoreProvider>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
