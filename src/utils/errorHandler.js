import { Alert } from 'react-native';

/**
 * Centralized error handler for API requests
 * @param {Error} error - The error object from axios
 * @param {string} defaultMessage - Default message to show if no specific error found
 */
export const handleApiError = (error, defaultMessage = 'An unexpected error occurred') => {
  let errorMessage = defaultMessage;
  
  if (error.response && error.response.data && error.response.data.error) {
    // Backend error with specific message
    errorMessage = error.response.data.error;
    console.log("Backend error:", error.response.data.error);
  } else if (error.request) {
    // Network error
    errorMessage = "No response from server. Check your network or API URL.";
    console.log("No response:", error.request);
  } else {
    // Other error
    errorMessage = `Unexpected error: ${error.message}`;
    console.log("Unexpected error:", error.message);
  }
  
  Alert.alert("Error", errorMessage);
  return errorMessage;
};

/**
 * Log error without showing alert (for silent error handling)
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = 'Unknown') => {
  console.error(`[${context}] Error:`, error);
};