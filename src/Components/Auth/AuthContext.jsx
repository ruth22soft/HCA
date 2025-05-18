import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', userData);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to log in a user
  const login = (userData) => {
    return new Promise((resolve) => {
      console.log('Login function called with:', userData);
      
      // Set the user in state
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Return the user data
      resolve(userData);
    });
  };

  // Function to log out a user
  const logout = () => {
    console.log('Logout function called');
    
    // Clear user from state
    setUser(null);
    
    // Remove from localStorage
    localStorage.removeItem('user');
  };

  // Create the context value object
  const value = {
    user,
    login,
    logout,
    loading
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
