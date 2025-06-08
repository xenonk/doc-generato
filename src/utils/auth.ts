import { getToken, getTokenData } from './token';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// Mock user data for development
const MOCK_USER: User = {
  id: 1,
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'admin',
  avatar: null
};

export const getCurrentUserId = (): number => {
  return MOCK_USER.id;
};

export const isAuthenticated = (): boolean => {
  return true; // Always return true for now
};

export const getUserRole = (): string => {
  return MOCK_USER.role;
};

export const hasPermission = (permission: string): boolean => {
  return true; // Grant all permissions for now
};

export const getUserProfile = (): User => {
  return MOCK_USER;
};

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Mock login - always succeed
  return Promise.resolve({
    user: MOCK_USER,
    token: 'mock_token'
  });
};

export const logout = (): Promise<void> => {
  // Mock logout
  return Promise.resolve();
}; 