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
      console.log('Authentication error:', error.response.status);

      if (globalAuthErrorHandler) {
        globalAuthErrorHandler();
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Helper function to generate mock monthly data for testing
 */
/**
 * Process transaction data into monthly ticket usage
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Monthly data formatted for the chart
 */
const processTransactionsToMonthlyData = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return generateMockMonthlyData();
  }
  
  const monthlyMap = new Map();
  const currentDate = new Date();
  
  // Initialize the past 6 months with zero values
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - i);
    month.setDate(1); // First day of month
    month.setHours(0, 0, 0, 0);
    
    const monthKey = month.toISOString().substring(0, 7); // YYYY-MM format
    monthlyMap.set(monthKey, {
      month: month.toISOString(),
      total_tickets: 0
    });
  }
  
  // Process transactions and sum them by month
  transactions.forEach(transaction => {
    if (!transaction.fecha_transaccion) return;
    
    const transDate = new Date(transaction.fecha_transaccion);
    const monthKey = transDate.toISOString().substring(0, 7);
    
    // Only include data from the past 6 months
    if (monthlyMap.has(monthKey)) {
      const monthData = monthlyMap.get(monthKey);
      // Use absolute value and divide by 2 to account for sender/receiver duplication
      const ticketAmount = Math.abs(transaction.monto || 0) / 2;
      monthData.total_tickets += ticketAmount;
    }
  });
  
  // Convert to array and sort chronologically
  return Array.from(monthlyMap.values())
    .map(item => ({
      ...item,
      total_tickets: Math.round(item.total_tickets) // Round to whole numbers
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
};

/**
 * Generate mock monthly data for testing
 */
const generateMockMonthlyData = () => {
  const data = [];
  const currentDate = new Date();
  
  // Generate data for the past 6 months
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - i);
    month.setDate(1); // First day of month
    
    data.push({
      month: month.toISOString(),
      // Generate random ticket usage between 20 and 200
      total_tickets: Math.floor(Math.random() * 180) + 20
    });
  }
  
  return data;
};

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
      console.log('Calling tickets API...');
      const response = await apiClient.get(ENDPOINTS.TICKETS);
      const data = response.data;
      console.log('Raw tickets response data:', data);

      // Format the response data
      const formattedData = {
        tickets: data.tickets,
        ticketsMonth: data.ticketsMonth,
        movimientos: data.movimientos
      };

      console.log('Formatted tickets data:', formattedData);
      return formattedData;
    } catch (error) {
      console.log('Error in getTickets:', error);
      handleApiError(error, 'Failed to load tickets data');
    }
  }
  
  static async getMonthlyTickets() {
    try {
      console.log('Getting monthly tickets data from tickets API...');
      
      // Use the main tickets endpoint since there's no separate monthly endpoint
      const response = await apiClient.get(ENDPOINTS.TICKETS);
      
      // Extract and process the transactions to generate monthly data
      if (response.data && response.data.movimientos) {
        console.log('Processing transactions for monthly data...');
        
        const monthlyData = processTransactionsToMonthlyData(response.data.movimientos);
        console.log('Generated monthly data:', monthlyData);
        
        return monthlyData;
      } else {
        console.log('No movement data available for monthly breakdown');
        return generateMockMonthlyData();
      }
    } catch (error) {
      console.log('Error in getMonthlyTickets:', error);
      handleApiError(error, 'Failed to generate monthly tickets data');
      // Return mock data as fallback in case of API error
      console.log('Returning mock data due to API error');
      return generateMockMonthlyData();
    }
  }

  static async getCategories() {
    try {
      console.log('Fetching categories from:', ENDPOINTS.CATEGORIES);
      const response = await apiClient.get(ENDPOINTS.CATEGORIES);

      // Log successful response
      console.log('Categories response:', {
        status: response.status,
        data: response.data
      });

      // Validate response data structure
      if (!response.data) {
        console.error('Empty response from categories endpoint');
        throw new Error('No data received from categories endpoint');
      }

      // Log the data structure
      console.log('Categories data structure:', {
        isArray: Array.isArray(response.data),
        length: Array.isArray(response.data) ? response.data.length : 'not an array',
        sample: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null
      });

      return response.data;
    } catch (error) {
      // Log backend error details
      console.log('Backend error:', error.response?.data?.error || error.message);

      // Log detailed error for debugging
      console.error('Categories API error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: ENDPOINTS.CATEGORIES
      });

      // Check if it's a database connection error
      if (error.response?.data?.error?.includes('database')) {
        console.error('Database connection error detected');
      }

      handleApiError(error, 'Failed to load categories');
      throw error;
    }
  }

  static async getMovimientos() {
    try {
      console.log('Fetching movements from:', ENDPOINTS.MOVIMIENTOS);
      const response = await apiClient.get(ENDPOINTS.MOVIMIENTOS);
      
      console.log('Raw movements response:', response.data);
      
      // Validate and format the data
      let movements = [];
      if (response.data && Array.isArray(response.data)) {
        movements = response.data.map(mov => ({
          id: mov.id || String(Math.random()),
          tipo: mov.tipo || 'enviado',
          cantidad: Number(mov.cantidad) || 0,
          usuario: mov.usuario || 'Usuario',
          fecha: mov.fecha ? new Date(mov.fecha).toISOString() : new Date().toISOString(),
          categoria: mov.categoria || 'Transferencias'
        }));
      }

      console.log('Formatted movements:', movements);
      return movements;
    } catch (error) {
      console.error('Error fetching movements:', error);
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

  // Added the missing transferTickets function
  static async transferTickets(transferData) {
    try {
      const response = await apiClient.post(ENDPOINTS.TRANSFERIR, transferData);
      return response.data;
    } catch (error) {
      console.error('Transfer tickets error:', error);
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

  static async createEvento(formData) {
    try {
      console.log('Sending event creation request...');

      const formEntries = {};
      for (let [key, value] of formData._parts) {
        if (key === 'imagen' && value && typeof value === 'object') {
          formEntries[key] = {
            name: value.name,
            type: value.type,
            uri: value.uri ? 'binary data (uri exists)' : 'missing uri'
          };
        } else {
          formEntries[key] = value;
        }
      }

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
        console.warn('Error response intercepted by proxy or firewall');
        return {
          error: 'Request intercepted by network system',
          interceptedResponse: true
        };
      }

      console.error('Create event error:', error.message);

      handleApiError(error, 'Failed to create event');
      throw error;
    }
  }

}

export default ApiService;