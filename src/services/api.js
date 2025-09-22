import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '@/constants';
import { getToken, handleApiError } from '@/utils';

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
      const ticketAmount = Math.abs(transaction.monto || 0); // Division by 2 removed
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

  static async getMovimientos() {
    try {
      const response = await apiClient.get(ENDPOINTS.MOVIMIENTOS);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load transaction history');
      throw error;
    }
  }

  static async getUsers() {
    try {
      const response = await apiClient.get(ENDPOINTS.USUARIOS);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load users');
      throw error;
    }
  }

  static async transferTickets(transferData) {
    try {
      const response = await apiClient.post(ENDPOINTS.TRANSFERIR, transferData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to transfer tickets');
      throw error;
    }
  }

  static async getEventos() {
    try {
      const response = await apiClient.get(ENDPOINTS.EVENTOS);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load events');
      throw error;
    }
  }

  static async getEventoById(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.EVENTOS}/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load event details');
      throw error;
    }
  }

  static async agendarEventos(id) {
    try {
      const response = await apiClient.post(`${ENDPOINTS.EVENTOS}/${id}/agendar`, { id });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to schedule event');
      throw error;
    }
  }

  static async getEventosAgendados() {
    try {
      const response = await apiClient.get(`${ENDPOINTS.AGENDA}`);
      return response.data;
    } catch (err) {
      handleApiError(err, 'Failed to load scheduled events');
      throw err;
    }
  }

  static async deleteEventoAgendado(id) {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.EVENTOS}/${id}/agendar`, { id });
      return response.data;
    } catch (err) {
      handleApiError(err, 'Failed to delete scheduled event');
      throw err;
    }
  }

  static async createEvent(formData) {
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

  static async getCoupons(){
    try {
      const response = await apiClient.get(ENDPOINTS.CUPONES);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load coupons');
      throw error;
    }
  }

  static async createCoupon(couponData) {
    try {
      const response = await apiClient.post(ENDPOINTS.CUPONES, couponData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to create coupon');
      throw error;
    }
  }
}

export default ApiService;
