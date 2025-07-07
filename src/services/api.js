import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../constants/config';
import { getToken, isLoggedIn } from '../utils/Token';
import { handleApiError } from '../utils/errorHandler';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Check if user is authenticated before making request
 */
const ensureAuthenticated = async () => {
  const userIsLoggedIn = await isLoggedIn();
  if (!userIsLoggedIn) {
    throw new Error('You must be logged in to access this feature.');
  }
};

/**
 * API Service Class
 */
export class ApiService {
  
  /**
   * User authentication
   */
  static async login(email, password) {
    try {
      const response = await apiClient.post(ENDPOINTS.LOGIN, {
        email,
        contraseña: password,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Login failed');
      throw error;
    }
  }

  /**
   * User registration
   */
  static async register(userData) {
    try {
      const response = await apiClient.post(ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Registration failed');
      throw error;
    }
  }

  /**
   * Get home data (user info and recent events)
   */
  static async getHomeData() {
    try {
      await ensureAuthenticated();
      const response = await apiClient.get(ENDPOINTS.HOME);
      return response.data;
    } catch (error) {
      if (error.message.includes('logged in')) {
        handleApiError(new Error(error.message));
      } else {
        handleApiError(error, 'Failed to load home data');
      }
      throw error;
    }
  }

  /**
   * Get tickets data
   */
  static async getTickets() {
    try {
      await ensureAuthenticated();
      const response = await apiClient.get(ENDPOINTS.TICKETS);
      return response.data;
    } catch (error) {
      if (error.message.includes('logged in')) {
        handleApiError(new Error(error.message));
      } else {
        handleApiError(error, 'Failed to load tickets data');
      }
      throw error;
    }
  }
}

export default ApiService;