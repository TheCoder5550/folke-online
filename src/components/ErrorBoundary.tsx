import { Component, type ErrorInfo, type ReactNode } from "react";
import { getBasePath } from "../helpers/generic-helper";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    message: "",
  };

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error);

    this.setState({
      hasError: true,
      message: error.message + errorInfo.componentStack,
    })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "2rem",
          maxWidth: "800px",
        }}>
          <h1>Sorry, there was an error.</h1>

          <p>Try reloading the page or go back to the home page. If the error persists, try clearing cookies and page data (This will delete all exercise progress and all proofs written in the editor!).</p>

          <details style={{
            marginBottom: "1rem"
          }}>
            <summary>Error message and callstack</summary>
            <pre style={{
              border: "1px solid rgb(var(--text-rgb), 0.2)",
              padding: "0.5em",
            }}>{this.state.message}</pre>
          </details>

          <div style={{
            display: "flex",
            gap: "1rem",
          }}>
            <button
              type="button"
              className="action-button"
              onClick={redirectHome}
            >
              Go back
            </button>
            <button
              type="button"
              className="action-button danger"
              style={{
                background: "none",
                border: "none",
              }}
              onClick={clearData}
            >
              Clear page data
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

function redirectHome() {
  window.location.href = getBasePath() + "/";
}

function clearData() {
  if (!confirm("Are you sure you want to clear the data? All exercise progress and created proofs will be lost!")) {
    return;
  }
  
  localStorage.clear();
  window.location.reload();
}