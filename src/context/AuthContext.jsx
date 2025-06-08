import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    role: 'admin'
  });

  const login = (credentials) => {
    // In a real app, this would make an API call
    console.log('Login with:', credentials);
    // For demo purposes, we'll just set the user
    setUser({
      id: '1',
      name: 'John Doe',
      email: credentials.email,
      avatar: null,
      role: 'admin'
    });
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 