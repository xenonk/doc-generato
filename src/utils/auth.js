import { getToken, getTokenData } from './token';

// Mock user data for development
const MOCK_USER = {
  id: 1,
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'admin',
  avatar: null
};

export const getCurrentUserId = () => {
  return MOCK_USER.id;
};

export const isAuthenticated = () => {
  return true; // Always return true for now
};

export const getUserRole = () => {
  return MOCK_USER.role;
};

export const hasPermission = (permission) => {
  return true; // Grant all permissions for now
};

export const getUserProfile = () => {
  return MOCK_USER;
};

export const login = async (credentials) => {
  // Mock login - always succeed
  return Promise.resolve({
    user: MOCK_USER,
    token: 'mock_token'
  });
};

export const logout = () => {
  // Mock logout
  return Promise.resolve();
}; 