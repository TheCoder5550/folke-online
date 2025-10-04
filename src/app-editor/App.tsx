import styles from "./App.module.css";
import Accordion from '../components/Accordion/Accordion'
import ActionBar from '../components/ActionBar/ActionBar'
import ContextMenu from '../components/ContextMenu/ContextMenu'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header/Header'
import ProofRenderer from '../components/ProofRenderer/ProofRenderer'
import { WasmProvider } from '../helpers/wasm-provider'
import { ProofStoreProvider } from '../stores/proof-store'
import { useState } from "react";

function App() {
  const [viewSidebar, setViewSidebar] = useState(true);

  return (
    <>
      <ErrorBoundary>
        <div className={styles["fixed"]}>
          <Header />
          <WasmProvider>
            <ProofStoreProvider localStorageName="current-proof-storage">
              <ActionBar
                viewSidebar={viewSidebar}
                setViewSidebar={setViewSidebar}
              />

              <div style={{
                display: "flex",
                overflow: "hidden",
              }}>
                {viewSidebar && (
                  <Accordion className={styles["sidebar"]}></Accordion>
                )}

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
            </ProofStoreProvider>

            <ContextMenu />
          </WasmProvider>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
