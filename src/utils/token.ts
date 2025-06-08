import { jwtDecode } from 'jwt-decode';

interface TokenData {
  exp: number;
  [key: string]: any;
}

const TOKEN_KEY = 'docuflow_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getTokenData = (): TokenData | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode<TokenData>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    removeToken();
    return null;
  }
};

export const isTokenExpired = (): boolean => {
  const tokenData = getTokenData();
  if (!tokenData) return true;
  
  const currentTime = Date.now() / 1000;
  return tokenData.exp < currentTime;
}; 