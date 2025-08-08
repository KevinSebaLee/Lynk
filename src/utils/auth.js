import { Alert } from 'react-native';
import { isLoggedIn } from './Token';

/**
 * Utility functions for authentication
 */

/**
 * Check if user is authenticated and show alert if not
 * @returns {Promise<boolean>} - Returns true if authenticated, false otherwise
 */
export const requireAuth = async () => {
  const userIsLoggedIn = await isLoggedIn();
  if (!userIsLoggedIn) {
    Alert.alert('Error', 'You must be logged in to access this feature.');
    return false;
  }
  return true;
};

/**
 * Wrapper function that executes callback only if user is authenticated
 * @param {Function} callback - Function to execute if authenticated
 * @returns {Function} - Wrapped function
 */
export const withAuth = (callback) => {
  return async (...args) => {
    const isAuthenticated = await requireAuth();
    if (isAuthenticated) {
      return callback(...args);
    }
  };
};