import { Alert } from 'react-native';

export const handleApiError = (error, defaultMessage = 'An unexpected error occurred') => {
  let errorMessage = defaultMessage;
  
  const isAuthError = error.response && (error.response.status === 401 || error.response.status === 403);
  
  if (isAuthError) {
    console.log('Auth error - token likely expired');
    return 'Authentication error';
  }
  
  if (error.response && error.response.data && error.response.data.error) {
    errorMessage = error.response.data.error;
    console.log('Backend error:', error.response.data.error);
  } else if (error.request) {
    // Network error
    errorMessage = 'No response from server. Check your network or API URL.';
    console.log('No response:', error.request);
  } else {
    // Other error
    errorMessage = `Unexpected error: ${error.message}`;
    console.log('Unexpected error:', error.message);
  }
  
  Alert.alert('Error', errorMessage);
  return errorMessage;
};

export const logError = (error, context = 'Unknown') => {
  // Skip auth errors in logs (they're expected and handled)
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    console.log(`[${context}] Auth error - handled by redirection`);
    return;
  }
  
  console.error(`[${context}] Error:`, error);
};