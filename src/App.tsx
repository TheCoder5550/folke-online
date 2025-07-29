import './App.css'
import ActionBar from './components/ActionBar'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import ProofRenderer from './components/ProofRenderer'
import { ProofStoreProvider } from './stores/proof-store'

// const markdownFileContent = (await import(`./exercises/exercise-1.md?raw`)).default;

function App() {
  return (
    <>
      <ErrorBoundary>
        <ProofStoreProvider localStorageName='current-proof-storage'>
          <Header />

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
