import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [permissions, setPermissions] = useState([]);

  const login = useCallback((userData) => {
    setUser(userData);
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('user'); // Clear user from localStorage
      setUser(null);
      setPermissions([]);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }, []);

  const updatePermissions = useCallback((newPermissions) => {
    setPermissions(newPermissions);
  }, []);

  const value = {
    user,
    permissions,
    login,
    logout,
    updatePermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
