import React, { createContext, useState, useEffect, useContext } from 'react';
import { isLoggedIn, removeToken, storeToken } from '../utils/Token';
import { setAuthErrorHandler } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDataCache, setUserDataCache] = useState(null);

  const logout = async () => {
    console.log("Logging out user due to expired token...");
    await removeToken();
    setIsAuthenticated(false);
    setUserDataCache(null);
  };

  useEffect(() => {
    setAuthErrorHandler(logout);

    (async () => {
      setIsAuthenticated(await isLoggedIn());
    })();
  }, []);

  const login = async (token, userData = null) => {
    await storeToken(token);

    if (userData) {
      setUserDataCache(userData);
    }

    setIsAuthenticated(true);
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