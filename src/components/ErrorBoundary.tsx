import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "2rem"
        }}>
          <h1>Sorry, there was an error.</h1>
          <p>Try refreshing the page</p>
          <p>If that doesn't work, try clearing cookies and page data</p>
          <button
            type="button"
            className="action-button danger"
            onClick={clearData}
          >
            Clear page data
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

function clearData() {
  if (!confirm("Are you sure you want to clear the data? All exercise progress and created proofs will be lost!")) {
    return;
  }
  
  localStorage.clear();
  window.location.reload();
}