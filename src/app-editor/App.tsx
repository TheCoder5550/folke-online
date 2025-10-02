import styles from "./App.module.css";
import Accordion from '../components/Accordion/Accordion'
import ActionBar from '../components/ActionBar/ActionBar'
import ContextMenu from '../components/ContextMenu/ContextMenu'
import ErrorBoundary from '../components/ErrorBoundary'
// import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import ProofRenderer from '../components/ProofRenderer/ProofRenderer'
import { WasmProvider } from '../helpers/wasm-provider'
// import { ProofStoreProvider } from '../stores/proof-store'
import { ProofCollectionStoreProvider } from "../stores/proof-collection-store";

function App() {
  return (
    <>
      <ErrorBoundary>
        <div className={styles["fixed"]}>
          <Header />
          <WasmProvider>
            <ProofCollectionStoreProvider>
              <ActionBar />

              <div style={{
                display: "flex",
                overflow: "hidden",
              }}>
                <Accordion className={styles["sidebar"]}></Accordion>

                <div className="paper-container" style={{
                  flex: "1",
                  overflow: "auto",
                  paddingBottom: "0",
                }}>
                  <div className="paper" style={{
                    marginBottom: "70vh"
                  }}>
                    <ProofRenderer />
                  </div>
                </div>
              </div>
            </ProofCollectionStoreProvider>

            <ContextMenu />
          </WasmProvider>
          {/* <Footer /> */}
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
