import { API } from '@env';

// API Configuration
export const API_CONFIG = {
  BASE_URL: API || "https://stirring-intense-sheep.ngrok-free.app",
  TIMEOUT: 5000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// API Endpoints
export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/register',
  HOME: '/',
  TICKETS: '/tickets',
  MOVIMIENTOS: '/tickets/transacciones',
  TRANSFERIR: "/tickets/transferir",
};

// App Constants
export const APP_CONSTANTS = {
  DEFAULT_COUNTRY_ID: 10,
  DEFAULT_GENDER_ID: 1,
  DEFAULT_PREMIUM_ID: 1,
};