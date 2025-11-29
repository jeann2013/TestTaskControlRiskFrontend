import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded shadow w-96 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but an unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details (Dev Mode)</summary>
                <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;