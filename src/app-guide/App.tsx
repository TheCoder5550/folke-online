import ContextMenu from '../components/ContextMenu/ContextMenu';
import ErrorBoundary from '../components/ErrorBoundary';
import Header from '../components/Header/Header';
import KeybindsTable from '../components/KeybindsTable/KeybindsTable';
import RulesTable from '../components/RulesTable/RulesTable';
import SymbolTable from '../components/SymbolTable/SymbolTable';

function App() {
  return (
    <>
      <ErrorBoundary>
        <Header />

        <div className="paper-container">
          <div className="paper invisible">
            <h1>Guide</h1>

            <h2>Symbol shortcuts</h2>
            <p>Various keyboard shortcuts exists to type special characters.</p>
            <SymbolTable />

            <br /><br />

            <h2>Rules</h2>
            <p>These rules (or <i>justifications</i>) are available</p>
            <RulesTable />

            <br /><br />

            <h2>Binding priority</h2>
            <p>Folke uses the following convention for binding priority between connectives:</p>
            <ol>
              <li>¬, ∀ and ∃ has the highest binding priority and bind the tightest</li>
              <li>∨ and ∧ bind the second tightest and are left-associative</li>
              <li>→ has the lowest binding priority and is right-associative</li>
            </ol>
            <p>Examples:</p>
            <ul>
              <li>A ∧ B ∧ C is equivalent to (A ∧ B) ∧ C</li>
              <li>A ∨ B ∨ C is equivalent to (A ∨ B) ∨ C</li>
              <li>A ∨ B ∧ C is equivalent to (A ∨ B) ∧ C</li>
              <li>A → B → C is equivalent to A → (B → C)</li>
              <li>∀x P(x) → ∃y Q(y) ∧ ¬R(z) is equivalent to (∀x P(x)) → ((∃y Q(y)) ∧ (¬R(z)))</li>
            </ul>

            <br /><br />

            <h2>Keyboard shortcuts</h2>
            <KeybindsTable />
          </div>
        </div>

        <ContextMenu />
      </ErrorBoundary>
    </>
  )
}

export default App
