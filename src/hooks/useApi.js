import React, { useState, useCallback, useEffect } from 'react';
import { logError } from '../utils/errorHandler';

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
      const isAuthError = err.response && (err.response.status === 401 || err.response.status === 403);
      
      setError(err);
      
      if (!isAuthError) {
        logError(err, 'useApi');
      } else {
        console.log('Auth error handled by interceptor - user being logged out');
      }
      
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