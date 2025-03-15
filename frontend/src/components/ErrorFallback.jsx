import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Error Fallback component to be used with React Error Boundary
 * @param {Object} props Component props
 * @param {Error} props.error The error that was caught
 * @param {Function} props.resetErrorBoundary Function to reset the error boundary
 * @param {string} props.componentName Optional name of the component that failed
 * @param {boolean} props.showHomeButton Whether to show the back to home button
 */
const ErrorFallback = ({ 
  error, 
  resetErrorBoundary, 
  componentName = "Component", 
  showHomeButton = true 
}) => {
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV;

  // Extract a user-friendly message from the error
  const getErrorMessage = () => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    // Handle network errors
    if (error?.message?.includes('Network Error')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    return error?.message || 'An unexpected error occurred';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-dark-50 border border-dark-200 shadow-lg text-center">
      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      
      <h2 className="text-xl font-bold text-white mb-2">
        {componentName} Error
      </h2>
      
      <p className="text-gray-300 mb-4 max-w-md">
        {getErrorMessage()}
      </p>
      
      {/* Show stack trace in development mode */}
      {isDevelopment && error?.stack && (
        <div className="mb-6 w-full max-w-lg">
          <details className="text-left">
            <summary className="text-gray-400 cursor-pointer text-sm mb-2 hover:text-gray-300 transition-colors">
              Technical Details
            </summary>
            <pre className="bg-dark-100 p-3 rounded text-xs text-red-300 overflow-x-auto max-h-60">
              {error.stack}
            </pre>
          </details>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="flex items-center justify-center px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </button>
        )}
        
        {showHomeButton && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-4 py-2 rounded-md bg-dark-200 text-white hover:bg-dark-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback; 