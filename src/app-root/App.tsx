import ActionBar from '../components/ActionBar/ActionBar'
import ContextMenu from '../components/ContextMenu/ContextMenu'
import ErrorBoundary from '../components/ErrorBoundary'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import ProofRenderer from '../components/ProofRenderer/ProofRenderer'
import { WasmProvider } from '../helpers/wasm-provider'
import { ProofStoreProvider } from '../stores/proof-store'

function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />
        <WasmProvider>
          <ProofStoreProvider localStorageName='current-proof-storage'>
            <ActionBar />

            <div className="paper-container">
              <div className="paper">
                <ProofRenderer />
              </div>
            </div>
          </ProofStoreProvider>

          <ContextMenu />
        </WasmProvider>
        <Footer />
      </ErrorBoundary>
    </>
  )
}

export default App
