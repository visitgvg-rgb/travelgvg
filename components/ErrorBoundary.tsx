import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-brand-bg-light dark:bg-gray-900">
          <div className="mb-6 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-gray-100 mb-4">Ажурирање на апликацијата</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
            Направивме нови подобрувања! Ве молиме освежете ја страницата за да ја вчитате најновата верзија.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-accent text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1"
          >
            Освежи (Reload)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;