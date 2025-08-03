import ActionBar from '../components/ActionBar/ActionBar'
import ContextMenu from '../components/ContextMenu/ContextMenu'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header/Header'
import ProofRenderer from '../components/ProofRenderer/ProofRenderer'
import RuleDictionary from '../components/RuleDictionary/RuleDictionary'
import { ProofStoreProvider } from '../stores/proof-store'

function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />
        <ProofStoreProvider localStorageName='current-proof-storage'>
          <RuleDictionary />

          <ActionBar />

          <div className="paper-container">
            <div className="paper">
              <ProofRenderer />
            </div>
          </div>
        </ProofStoreProvider>

        <ContextMenu />
      </ErrorBoundary>
    </>
  )
}

export default App
