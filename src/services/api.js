import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '@/constants';
import { getToken, handleApiError } from '@/utils';
import { Alert } from 'react-native';

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
      const ticketAmount = Math.abs(transaction.monto || 0); 
      monthData.total_tickets += ticketAmount;
    }
  });
  
  return Array.from(monthlyMap.values())
    .map(item => {
      const date = new Date(item.month);
      return {
        month: date.getMonth() + 1, // Convert to 1-12 format
        tickets: Math.round(item.total_tickets),
        year: date.getFullYear()
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
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
      month: month.getMonth() + 1, // Convert to 1-12 format
      tickets: Math.floor(Math.random() * 180) + 20,
      year: month.getFullYear()
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
      console.log(response.data.id_creador)
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load event details');
      throw error;
    }
  }

  static async agendarEvento(id) {
    if (!id) {
      throw new Error('Event ID is required to schedule the event');
    }

    try {
      const response = await apiClient.post(`${ENDPOINTS.EVENTOS}/${id}/agendar`, { id });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to schedule event');
      throw error;
    }
  }

  static async agendarEventos(id) {
    return this.agendarEvento(id);
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
    if (!id) {
      throw new Error('Event ID is required to remove the scheduled event');
    }

    try {
      const response = await apiClient.delete(`${ENDPOINTS.EVENTOS}/${id}/agendar`);
      return response.data;
    } catch (err) {
      handleApiError(err, 'Failed to delete scheduled event');
      throw err;
    }
  }

  static async getMonthlyInscriptionsByEventId(eventId) {
  if (!eventId) {
    throw new Error('Event ID is required to fetch monthly inscriptions');
  }
  try {
    const response = await apiClient.get(`${ENDPOINTS.EVENTOS}/${eventId}/inscripciones-mensuales`);
    return response.data; // [{ month: X, inscriptions: Y }, ...]
  } catch (error) {
    handleApiError(error, 'Failed to load monthly inscriptions');
    throw error;
  }
}

   static async deleteEventoPropio(id) {
    if (!id) {
      throw new Error('Event ID is required to remove the scheduled event');
    }

    try {
      const response = await apiClient.delete(`${ENDPOINTS.EVENTOS}/${id}`);
      return response.data;
    } catch (err) {
      handleApiError(err, 'Failed to delete scheduled event');
      throw err;
    }
  }

  static async getEventoScheduledUsers(id) {
    if (!id) {
      throw new Error('Event ID is required to fetch scheduled users');
    }

    const paths = [
      `${ENDPOINTS.EVENTOS}/${id}/agendados`,
      `${ENDPOINTS.EVENTOS}/${id}/agendar`,
      `${ENDPOINTS.EVENTOS}/${id}/inscripciones`,
    ];

    let lastError = null;

    for (const path of paths) {
      try {
        const response = await apiClient.get(path);
        return response.data;
      } catch (error) {
        lastError = error;
        const status = error?.response?.status;
        if (status && [404, 405].includes(status)) {
          continue;
        }
        handleApiError(error, 'Failed to load scheduled users');
        throw error;
      }
    }

    if (lastError) {
      handleApiError(lastError, 'Failed to load scheduled users');
      throw lastError;
    }

    throw new Error('No se pudieron obtener los usuarios agendados');
  }

  static async getParticipantesEvento(eventoId) {
  try {
    const response = await apiClient.get(`${ENDPOINTS.EVENTOS}/${eventoId}/participantes`);
    return response.data; 
  } catch (error) {
    handleApiError(error, 'Failed to load event participants');
    throw error;
  }
}

  // static async deleteEvento(id) {
  //   if (!id) {
  //     throw new Error('Event ID is required to delete the event');
  //   }

  //   const paths = [
  //     `${ENDPOINTS.EVENTOS}/${id}`,
  //     `${ENDPOINTS.EVENTOS}/${id}/delete`,
  //   ];

  //   let lastError = null;

  //   for (const path of paths) {
  //     try {
  //       const response = await apiClient.delete(path);
  //       return response.data;
  //     } catch (error) {
  //       lastError = error;
  //       const status = error?.response?.status;
  //       if (status && [404, 405].includes(status)) {
  //         continue;
  //       }
  //       handleApiError(error, 'Failed to delete event');
  //       throw error;
  //     }
  //   }

  //   if (lastError) {
  //     handleApiError(lastError, 'Failed to delete event');
  //     throw lastError;
  //   }

  //   throw new Error('No se pudo eliminar el evento');
  // }

  // static borrarEvento(id) {
  //   return this.deleteEvento(id);
  // }

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

  static async redeemCoupon(couponId) {
    if (!couponId) {
      throw new Error('Coupon ID is required to redeem the coupon');
    }

    const redemptionPaths = [
      `${ENDPOINTS.CUPONES}/${couponId}/redeem`,
      `${ENDPOINTS.CUPONES}/${couponId}/usar`,
      `${ENDPOINTS.CUPONES}/${couponId}/claim`,
    ];

    let lastError = null;

    for (const path of redemptionPaths) {
      try {
        const response = await apiClient.post(path);
        return response.data;
      } catch (error) {
        lastError = error;

        const status = error?.response?.status;
        if (status && [404, 405].includes(status)) {
          // Try the next fallback endpoint if the current one doesn't exist
          continue;
        }

        handleApiError(error, 'No se pudo canjear el cupón');
        throw error;
      }
    }

    if (lastError) {
      handleApiError(lastError, 'No se pudo canjear el cupón');
      throw lastError;
    }

    throw new Error('No se pudo canjear el cupón. Intenta nuevamente más tarde.');
  }
}

export default ApiService;
