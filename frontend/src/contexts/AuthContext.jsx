import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Clear any existing data when component mounts
    localStorage.removeItem('user');
  }, []);

  const login = (userData) => {
    if (!userData || !userData.id || !userData.role) {
      console.error('Invalid user data');
      return;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const validateAndLoadUser = () => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id && parsedUser.role) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    validateAndLoadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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