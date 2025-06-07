import axios from 'axios';

const API_URL = process.env.REACT_APP_DIRECTUS_URL || 'http://localhost:8055';
const API_TOKEN = process.env.REACT_APP_DIRECTUS_TOKEN;

const directus = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const handleDirectusError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.message || 'An error occurred with the server';
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
};

// Extend directus with common methods
directus.files = {
  createOne: async (formData) => {
    const response = await directus.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  readOne: async (fileId) => {
    const response = await directus.get(`/files/${fileId}`);
    return response.data.data;
  },
  deleteOne: async (fileId) => {
    await directus.delete(`/files/${fileId}`);
    return true;
  },
};

directus.items = (collection) => ({
  readByQuery: async (query = {}) => {
    const response = await directus.get(`/items/${collection}`, { params: query });
    return response.data;
  },
  readOne: async (id) => {
    const response = await directus.get(`/items/${collection}/${id}`);
    return response.data.data;
  },
  createOne: async (data) => {
    const response = await directus.post(`/items/${collection}`, data);
    return response.data.data;
  },
  updateOne: async (id, data) => {
    const response = await directus.patch(`/items/${collection}/${id}`, data);
    return response.data.data;
  },
  deleteOne: async (id) => {
    await directus.delete(`/items/${collection}/${id}`);
    return true;
  },
});

export default directus; 