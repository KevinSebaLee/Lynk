import React, { createContext, useState, useEffect, useContext } from 'react';
import { isLoggedIn, removeToken, storeToken } from '../utils/Token';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      setIsAuthenticated(await isLoggedIn());
    })();
  }, []);

  const login = async (token) => {
    console.log(token)

    await storeToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await removeToken();
    setIsAuthenticated(false);
  };

  const checkAuth = async () => {
    setIsAuthenticated(await isLoggedIn());
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);