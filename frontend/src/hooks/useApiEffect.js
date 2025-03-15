import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for handling API calls with loading, error, and data states
 * 
 * @param {Function} apiCall - The async function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {Object} options - Additional options
 * @param {boolean} options.showErrorToast - Whether to show error toast
 * @param {boolean} options.showSuccessToast - Whether to show success toast
 * @param {string} options.successMessage - Custom success message
 * @param {Function} options.onSuccess - Callback on successful API call
 * @param {Function} options.onError - Callback on API error
 * 
 * @returns {Object} { data, isLoading, error, refetch }
 */
const useApiEffect = (apiCall, dependencies = [], options = {}) => {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = 'Operation successful',
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      setIsLoading(false);
      
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      console.error('API Error:', err);
      
      setError(err);
      setIsLoading(false);
      
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      
      if (showErrorToast) {
        // Only show toast for actual API errors, not network issues
        if (err.response || !err.message.includes('Network Error')) {
          toast.error(errorMessage);
        }
      }
      
      if (onError) {
        onError(err);
      }
      
      return null;
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Return data, loading state, error, and a refetch function
  return { data, isLoading, error, refetch: fetchData };
};

export default useApiEffect; 