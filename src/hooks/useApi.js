import React, { useState, useCallback, useEffect } from 'react';
import { logError } from '../utils/errorHandler';

/**
 * Custom hook for handling API calls with state management
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {boolean} executeOnMount - Whether to execute the API call when the component mounts
 * @returns {Object} API state and control functions
 */
export const useApi = (apiFunction, executeOnMount = false) => {
  // State for API call results and status
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(executeOnMount);
  const [error, setError] = useState(null);

  /**
   * Execute the API call with the provided parameters
   * Manages loading state and error handling
   */
  const execute = useCallback(async (...params) => {
    try {
      // Set loading state and clear any previous errors
      setLoading(true);
      setError(null);
      
      // Execute the API call
      const result = await apiFunction(...params);
      setData(result);
      return result;
    } catch (err) {
      // Check if this is an authentication error
      const isAuthError = err.response && (err.response.status === 401 || err.response.status === 403);
      
      // Store the error in state
      setError(err);
      
      // Handle different error types
      if (!isAuthError) {
        // Log non-auth errors
        logError(err, 'useApi');
      } else {
        // Auth errors are typically handled by axios interceptors
        console.log('Auth error handled by interceptor - user being logged out');
      }
      
      // Re-throw the error for the caller to handle if needed
      throw err;
    } finally {
      // Always clear loading state when done
      setLoading(false);
    }
  }, [apiFunction]);

  /**
   * Reset the API call state
   * Useful when you want to clear previous results
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Return the state and control functions
  return {
    data,      // API response data
    loading,   // Loading state
    error,     // Error state
    execute,   // Function to execute the API call
    reset,     // Function to reset the state
  };
};

/**
 * Hook for making an API call immediately when component mounts
 * Includes dependency tracking for conditionally re-fetching
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies to trigger re-fetching
 * @returns {Object} API state and refetch function
 */
export const useApiCall = (apiFunction, dependencies = []) => {
  // Use the base useApi hook
  const { data, loading, error, execute } = useApi(apiFunction);

  // Track if the initial fetch has been done
  const [mounted, setMounted] = useState(false);

  // Execute the API call once on mount or when dependencies change
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      execute().catch(err => {
        // Error is already handled by useApi
        // This catch prevents unhandled promise rejection warnings
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, mounted, ...dependencies]);

  return {
    data,          // API response data
    loading,       // Loading state
    error,         // Error state
    refetch: execute, // Function to manually trigger a refetch
  };
};

export default useApi;