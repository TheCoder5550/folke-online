import ContextMenu from '../components/ContextMenu/ContextMenu';
import ErrorBoundary from '../components/ErrorBoundary';
import Header from '../components/Header/Header';
import RulesTable from '../components/RulesTable/RulesTable';
import SymbolTable from '../components/SymbolTable/SymbolTable';

function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />

        <div className="paper-container">
          <div className="paper">
            <h1>Guide</h1>

            <h2>Symbol shortcuts</h2>
            <p>Various shortcuts exists to type special characters.</p>
            <SymbolTable />

            <br /><br />

            <h2>Rules</h2>
            <p>These rules (or <i>justifications</i>) are available</p>
            <RulesTable />
          </div>
        </div>

        <ContextMenu />
      </ErrorBoundary>
    </>
  )
}

export default App
