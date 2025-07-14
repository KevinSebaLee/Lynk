import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../constants/config';
import { getToken } from '../utils/Token';
import { handleApiError } from '../utils/errorHandler';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

let globalAuthErrorHandler = null;

export const setAuthErrorHandler = (handler) => {
  globalAuthErrorHandler = handler;
};

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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log("Authentication error:", error.response.status);
      
      if (globalAuthErrorHandler) {
        globalAuthErrorHandler();
      }
    }
    return Promise.reject(error);
  }
);

/**
 * API Service Class
 */
export class ApiService {
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

  static async register(userData) {
  try {
    const response = await apiClient.post(ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Registration failed');
    throw error;
  }
}

  static async getHomeData() {
    try {
      const response = await apiClient.get(ENDPOINTS.HOME);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load home data');
      throw error;
    }
  }

  static async getTickets() {
    try {
      console.log("Calling API...");
      const response = await apiClient.get(ENDPOINTS.TICKETS);
      return response.data;
    } catch (error) {
      console.log("Error in getTickets:", error);
      handleApiError(error, 'Failed to load tickets data');
      throw error;
    }
  }

  static async getMovimientos(){
    try{
      const response = await apiClient.get(ENDPOINTS.MOVIMIENTOS);
      return response.data;
    }catch(error){
      handleApiError(error, 'Failed to load movements data');
      throw error;
    }
  }

  static async getUsers() {
    try {
      const response = await apiClient.get(ENDPOINTS.TRANSFERIR); 
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load users data');
      throw error;
    }
  }

  static async getEventos(){
    try{
      const response = await apiClient.get(ENDPOINTS.EVENTOS)
      return response.data
    }catch(error){
      handleApiError(error, 'Failed to load events')
      throw error
    }
  }

  static async getEventoById(id){
    try{
      const response = await apiClient.get(`${ENDPOINTS.EVENTO_BY_ID}/${id}`)
      return response.data
    }catch(error){
      handleApiError(error, 'Failed to load event details')
      throw error
    }
  }
}

export default ApiService;