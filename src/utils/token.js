import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'docuflow_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getTokenData = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    removeToken();
    return null;
  }
};

export const isTokenExpired = () => {
  const tokenData = getTokenData();
  if (!tokenData) return true;
  
  const currentTime = Date.now() / 1000;
  return tokenData.exp < currentTime;
}; 