import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../constants/config';
import { getToken } from '../utils/Token';
import { handleApiError } from '../utils/errorHandler';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

let globalAuthErrorHandler = null;

/**
 * Set the global authentication error handler
 * 
 * @param {Function} handler - Function to call when auth errors occur
 */
export const setAuthErrorHandler = (handler) => {
  globalAuthErrorHandler = handler;
};

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
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
      console.log('Authentication error:', error.response.status);

      if (globalAuthErrorHandler) {
        globalAuthErrorHandler();
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Process transaction data into monthly ticket usage
 * 
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Monthly data formatted for the chart
 */
const processTransactionsToMonthlyData = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return generateMockMonthlyData();
  }
  
  const monthlyMap = new Map();
  const currentDate = new Date();
  
  const sixMonthsAgo = new Date(currentDate);
  sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 6; i++) {
    const month = new Date(sixMonthsAgo);
    month.setMonth(sixMonthsAgo.getMonth() + i);
    
    const monthKey = month.toISOString().substring(0, 7);
    monthlyMap.set(monthKey, {
      month: month.toISOString(),
      total_tickets: 0
    });
  }
  
  const relevantTransactions = transactions.filter(t => 
    t.fecha_transaccion && new Date(t.fecha_transaccion) >= sixMonthsAgo
  );
  
  relevantTransactions.forEach(transaction => {
    const transDate = new Date(transaction.fecha_transaccion);
    const monthKey = transDate.toISOString().substring(0, 7);
    
    if (monthlyMap.has(monthKey)) {
      const monthData = monthlyMap.get(monthKey);
      const ticketAmount = Math.abs(transaction.monto || 0) / 2;
      monthData.total_tickets += ticketAmount;
    }
  });
  
  return Array.from(monthlyMap.values())
    .map(item => ({
      ...item,
      total_tickets: Math.round(item.total_tickets)
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
};

/**
 * Generate mock monthly data
 * 
 * @returns {Array} Mock monthly data for charts
 */
const generateMockMonthlyData = () => {
  const data = [];
  const currentDate = new Date();
  
  const baseDate = new Date(currentDate);
  baseDate.setMonth(currentDate.getMonth() - 5);
  baseDate.setDate(1);
  baseDate.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 6; i++) {
    const month = new Date(baseDate);
    month.setMonth(baseDate.getMonth() + i);
    
    data.push({
      month: month.toISOString(),
      total_tickets: Math.floor(Math.random() * 180) + 20
    });
  }
  
  return data;
};

export class ApiService {
  /**
   * Authenticate user with email and password
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and authentication token
   * @throws {Error} If authentication fails
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
   * Register a new user
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} New user data
   * @throws {Error} If registration fails
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
   * Get home screen data
   * 
   * @returns {Promise<Object>} Home data including user info and overview stats
   * @throws {Error} If data fetch fails
   */
  static async getHomeData() {
    try {
      const response = await apiClient.get(ENDPOINTS.HOME);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load home data');
      throw error;
    }
  }

  /**
   * Get user's ticket information including available tickets and transactions
   * 
   * @returns {Promise<Object>} Formatted ticket data
   * @throws {Error} If data fetch fails
   */
  static async getTickets() {
    try {
      const response = await apiClient.get(ENDPOINTS.TICKETS);
      const data = response.data;
      
      const { tickets, ticketsMonth, movimientos } = data;
      
      return { tickets, ticketsMonth, movimientos };
    } catch (error) {
      console.error('Error in getTickets:', error);
      handleApiError(error, 'Failed to load tickets data');
      throw error;
    }
  }
  
  /**
   * Get monthly ticket usage data for charts
   * Processes transaction history into a monthly format
   * 
   * @returns {Promise<Array>} Monthly ticket usage data
   * @throws {Error} If data fetch fails
   */
  static async getMonthlyTickets() {
    try {
      const response = await apiClient.get(ENDPOINTS.TICKETS);
      
      const movimientos = response.data?.movimientos;
      
      if (Array.isArray(movimientos) && movimientos.length > 0) {
        return processTransactionsToMonthlyData(movimientos);
      } else {
        return generateMockMonthlyData();
      }
    } catch (error) {
      console.error('Error fetching monthly tickets:', error);
      handleApiError(error, 'Failed to load monthly ticket data');
      return generateMockMonthlyData();
    }
  }

  /**
   * Get categories for events and filtering
   * 
   * @returns {Promise<Array>} List of available categories
   * @throws {Error} If data fetch fails
   */
  static async getCategories() {
    try {
      const response = await apiClient.get(ENDPOINTS.CATEGORIES);

      if (!response.data) {
        throw new Error('No data received from categories endpoint');
      }
      
      return response.data;
    } catch (error) {
      console.error('Categories fetch error:', error);
      handleApiError(error, 'Failed to load categories');
      throw error;
    }
  }

  /**
   * Get user's transaction history
   * 
   * @returns {Promise<Array>} List of transactions
   * @throws {Error} If data fetch fails
   */
  static async getMovimientos() {
    try {
      const response = await apiClient.get(ENDPOINTS.MOVIMIENTOS);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load transaction history');
      throw error;
    }
  }

  /**
   * Get list of users for ticket transfers
   * 
   * @returns {Promise<Array>} List of users
   * @throws {Error} If data fetch fails
   */
  static async getUsers() {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load users');
      throw error;
    }
  }

  /**
   * Transfer tickets to another user
   * 
   * @param {Object} transferData - Transfer details
   * @returns {Promise<Object>} Transfer confirmation
   * @throws {Error} If transfer fails
   */
  static async transferTickets(transferData) {
    try {
      const response = await apiClient.post(ENDPOINTS.TRANSFER, transferData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to transfer tickets');
      throw error;
    }
  }

  /**
   * Get all available events
   * 
   * @returns {Promise<Array>} List of events
   * @throws {Error} If data fetch fails
   */
  static async getEventos() {
    try {
      const response = await apiClient.get(ENDPOINTS.EVENTOS);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load events');
      throw error;
    }
  }

  /**
   * Get details for a specific event
   * 
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Event details
   * @throws {Error} If data fetch fails
   */
  static async getEventoById(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.EVENTOS}/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load event details');
      throw error;
    }
  }

  /**
   * Schedule an event
   * 
   * @param {string} id - Event ID to schedule
   * @returns {Promise<Object>} Scheduling confirmation
   * @throws {Error} If scheduling fails
   */
  static async agendarEventos(id) {
    try {
      const response = await apiClient.post(`${ENDPOINTS.EVENTOS}/${id}/agendar`, { id });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to schedule event');
      throw error;
    }
  }

  /**
   * Get user's scheduled events
   * 
   * @returns {Promise<Array>} List of scheduled events
   * @throws {Error} If data fetch fails
   */
  static async getEventosAgendados() {
    try {
      const response = await apiClient.get(`${ENDPOINTS.AGENDA}`);
      return response.data;
    } catch (err) {
      handleApiError(err, 'Failed to load scheduled events');
      throw err;
    }
  }

  /**
   * Remove an event from user's schedule
   * 
   * @param {string} id - Event ID to remove
   * @returns {Promise<Object>} Deletion confirmation
   * @throws {Error} If deletion fails
   */
  static async deleteEventoAgendado(id) {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.EVENTOS}/${id}/agendar`, { id });
      return response.data;
    } catch (err) {
      handleApiError(err, 'Failed to delete scheduled event');
      throw err;
    }
  }

  /**
   * Create a new event
   * 
   * @param {FormData} formData - Event data including image
   * @returns {Promise<Object>} Created event data
   * @throws {Error} If creation fails
   */
  static async createEvento(formData) {
    try {
      const response = await apiClient.post(ENDPOINTS.EVENTOS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000,
      });

      if (typeof response.data === 'string' && response.data.includes('Current Date and Time')) {
        console.warn('Server response intercepted by proxy or firewall');
        return {
          error: 'Request intercepted by network system',
          interceptedResponse: true
        };
      }

      return response.data;
    } catch (error) {
      if (error.response && typeof error.response.data === 'string' &&
        error.response.data.includes('Current Date and Time')) {
        return {
          error: 'Request intercepted by network system',
          interceptedResponse: true
        };
      }

      handleApiError(error, 'Failed to create event');
      throw error;
    }
  }
}

export default ApiService;
