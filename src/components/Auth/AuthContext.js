import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
 // Use this to decode the JWT token

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      setIsAuthenticated(true);
      setUser(jwtDecode(token)); // Decode and set the user information
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('access', token);
    setIsAuthenticated(true);
    setUser(jwtDecode(token)); // Decode and set the user information
  };

  const logout = () => {
    localStorage.removeItem('access');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
