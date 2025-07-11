import React, { createContext, useState, useEffect, useContext } from 'react';
import { isLoggedIn, removeToken, storeToken } from '../utils/Token';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDataCache, setUserDataCache] = useState(null);

  useEffect(() => {
    (async () => {
      setIsAuthenticated(await isLoggedIn());
    })();
  }, []);

  const login = async (token, userData = null) => {
    await storeToken(token);
    setIsAuthenticated(true);
    if (userData) {
      setUserDataCache(userData);
    }
  };

  const logout = async () => {
    await removeToken();
    setIsAuthenticated(false);
    setUserDataCache(null);
  };

  const checkAuth = async () => {
    setIsAuthenticated(await isLoggedIn());
  };

  const clearUserDataCache = () => {
    setUserDataCache(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      checkAuth, 
      userDataCache, 
      clearUserDataCache 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);