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
 * API Service Class
 */
export class ApiService {
  static async login(email, password) {
    try {
      const response = await apiClient.post(ENDPOINTS.LOGIN, {
        username: email,
        password: password,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Login failed');
      throw error;
    }
  }

  static async register(userData) {
    try {
      // Transform data to match backend expectations
      const registerData = {
        first_name: userData.nombre,
        last_name: userData.apellido || '',
        username: userData.email,
        password: userData.contraseña,
      };
      
      const response = await apiClient.post(ENDPOINTS.REGISTER, registerData);
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
      console.log('Calling API...');
      const response = await apiClient.get(ENDPOINTS.TICKETS);
      return response.data;
    } catch (error) {
      console.log('Error in getTickets:', error);
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

  static async getEventos(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add search params
      if (params.name) queryParams.append('name', params.name);
      if (params.startdate) queryParams.append('startdate', params.startdate);
      if (params.tag) queryParams.append('tag', params.tag);
      
      const url = queryParams.toString() ? 
        `${ENDPOINTS.EVENTS}?${queryParams.toString()}` : 
        ENDPOINTS.EVENTS;
        
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load events');
      throw error;
    }
  }

  static async getEventoById(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.EVENTS}/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load event details');
      throw error;
    }
  }

  static async agendarEvento(id) {
    try {
      const response = await apiClient.post(`${ENDPOINTS.EVENTS}/${id}/enrollment`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to enroll in event');
      throw error;
    }
  }

  static async deleteEventoAgendado(id) {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.EVENTS}/${id}/enrollment`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to unenroll from event');
      throw error;
    }
  }

  static async createEvent(eventData) {
    try {
      const response = await apiClient.post(ENDPOINTS.EVENTS, eventData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to create event');
      throw error;
    }
  }

  static async updateEvent(eventData) {
    try {
      const response = await apiClient.put(ENDPOINTS.EVENTS, eventData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update event');
      throw error;
    }
  }

  static async deleteEvent(id) {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.EVENTS}/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to delete event');
      throw error;
    }
  }

  // Event Location Management
  static async getEventLocations() {
    try {
      const response = await apiClient.get(ENDPOINTS.EVENT_LOCATIONS);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load event locations');
      throw error;
    }
  }

  static async getEventLocationById(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.EVENT_LOCATIONS}/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to load event location');
      throw error;
    }
  }

  static async createEventLocation(locationData) {
    try {
      const response = await apiClient.post(ENDPOINTS.EVENT_LOCATIONS, locationData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to create event location');
      throw error;
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
      
      const response = await apiClient.post(ENDPOINTS.EVENTS, formData, {
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

  // Keep for backwards compatibility
  static async getEventosAgendados() {
    try {
      const response = await apiClient.get(`${ENDPOINTS.AGENDA}`);
      return response.data;
    } catch (err) {
      handleApiError(err, 'Failed to load scheduled events');
      throw err;
    }
  }
}

export default ApiService;