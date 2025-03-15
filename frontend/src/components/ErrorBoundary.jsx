import { Component } from 'react';
import ErrorFallback from './ErrorFallback';

/**
 * Error Boundary component to catch errors in its child component tree
 * Renders the ErrorFallback component when an error occurs
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call onError prop if it exists
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    // Reset the error state
    this.setState({ hasError: false, error: null });
    
    // Call onReset prop if it exists
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { componentName, showHomeButton, children } = this.props;
    
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          componentName={componentName}
          showHomeButton={showHomeButton}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary; 