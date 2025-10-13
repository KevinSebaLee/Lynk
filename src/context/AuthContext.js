import React, { createContext, useState, useEffect, useContext } from 'react';
import { isLoggedIn, removeToken, storeToken, getToken } from '../utils/Token';
import { setAuthErrorHandler } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDataCache, setUserDataCache] = useState(null);
  const [esEmpresa, setEsEmpresa] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  const logout = async () => {
    await removeToken();
    setIsAuthenticated(false);
    setUserDataCache(null);
    setEsEmpresa(false);
  };

  const checkAndDecodeToken = async () => {
    const token = await getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEsEmpresa(!!decoded.esEmpresa);
        return true;
      } catch (error) {
        console.error('JWT decode error:', error);
        setEsEmpresa(false);
        return false;
      }
    }
    setEsEmpresa(false);
    return false;
  };

  useEffect(() => {
    setAuthErrorHandler(logout);
    (async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        await checkAndDecodeToken();
      }
      setIsAuthenticated(loggedIn);
      setAuthInitialized(true);
    })();
  }, []);

  const login = async (token, userData = null) => {
    await storeToken(token);
    try {
      const decoded = jwtDecode(token);
      setEsEmpresa(!!decoded.esEmpresa);
    } catch (error) {
      console.error('JWT decode error during login:', error);
      setEsEmpresa(false);
    }
    if (userData) {
      setUserDataCache(userData);
    }
    setIsAuthenticated(true);
  };

  const checkAuth = async () => {
    const loggedIn = await isLoggedIn();
    if (loggedIn) {
      await checkAndDecodeToken();
    }
    setIsAuthenticated(loggedIn);
  };

  const clearUserDataCache = () => setUserDataCache(null);

  const value = {
    isAuthenticated,
    login,
    logout,
    checkAuth,
    userDataCache,
    clearUserDataCache,
    esEmpresa,
    authInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Safer hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export { AuthContext };