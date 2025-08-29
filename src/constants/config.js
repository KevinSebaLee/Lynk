import { API } from '@env';

// API Configuration
export const API_CONFIG = {
  BASE_URL: API || 'https://stirring-intense-sheep.ngrok-free.app',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// API Endpoints
export const ENDPOINTS = {
  LOGIN: '/api/user/login',
  REGISTER: '/api/user/register',
  EVENTS: '/api/event',
  EVENT_LOCATIONS: '/api/event-location',
  HOME: '/',
  TICKETS: '/tickets',
  MOVIMIENTOS: '/tickets/transacciones',
  TRANSFERIR: '/tickets/transferir',
  EVENTOS: '/api/event', // Keep for backwards compatibility
  AGENDA: '/agenda',
};

// App Constants
export const APP_CONSTANTS = {
  DEFAULT_COUNTRY_ID: 10,
  DEFAULT_GENDER_ID: 1,
  DEFAULT_PREMIUM_ID: 1,
};