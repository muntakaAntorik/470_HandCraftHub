// client/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Ensure 'jwt-decode' is installed: npm install jwt-decode

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Effect to decode token and set user/login status when token changes
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser.user); // Assuming your token payload has a 'user' object like { id: '...', role: '...' }
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        // If token is invalid, clear it
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, [token]);

  // Function to handle user login
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  // Provide the context values to children components
    return (
      <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

// Custom hook to easily use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
