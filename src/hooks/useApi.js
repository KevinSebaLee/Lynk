import React, { useState, useCallback, useEffect } from 'react';
import { logError } from '../utils/errorHandler';

/**
 * Custom hook for handling API calls with loading states
 * @param {Function} apiFunction - The API function to call
 * @param {boolean} executeOnMount - Whether to execute the API call on component mount
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction, executeOnMount = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(executeOnMount);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...params);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      logError(err, 'useApi');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

/**
 * Hook for API calls that execute immediately
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies for the effect
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useApiCall = (apiFunction, dependencies = []) => {
  const { data, loading, error, execute } = useApi(apiFunction);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      execute();
    }
  }, [execute, mounted, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
};

export default useApi;