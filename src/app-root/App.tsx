import ActionBar from '../components/ActionBar/ActionBar'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header/Header'
import ProofRenderer from '../components/ProofRenderer/ProofRenderer'
import { ProofStoreProvider } from '../stores/proof-store'

function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />
        <ProofStoreProvider localStorageName='current-proof-storage'>

          <ActionBar />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "1rem", paddingBottom: "1rem" }}>
            <div style={{ padding: "3rem 6rem", border: "1px solid rgb(0, 0, 0, 0.2)", background: "white", width: "100%", maxWidth: "1000px" }}>
              <ProofRenderer />
            </div>
          </div>
        </ProofStoreProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
