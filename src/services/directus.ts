import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = process.env.REACT_APP_DIRECTUS_URL || 'http://localhost:8055';
const API_TOKEN = process.env.REACT_APP_DIRECTUS_TOKEN;

interface DirectusResponse<T> {
  data: T;
  meta?: {
    total_count?: number;
    filter_count?: number;
  };
}

interface DirectusFile {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  filesize: number;
  uploaded_by: string;
  uploaded_on: string;
  modified_by: string;
  modified_on: string;
}

interface DirectusItem {
  id: string | number;
  [key: string]: any;
}

interface QueryParams {
  filter?: Record<string, any>;
  sort?: string[];
  limit?: number;
  fields?: string[];
  [key: string]: any;
}

interface DirectusInstance extends AxiosInstance {
  files: {
    createOne: (formData: FormData) => Promise<DirectusFile>;
    readOne: (fileId: string) => Promise<DirectusFile>;
    deleteOne: (fileId: string) => Promise<boolean>;
  };
  items: (collection: string) => {
    readByQuery: (query?: QueryParams) => Promise<DirectusResponse<DirectusItem[]>>;
    readOne: (id: string | number) => Promise<DirectusResponse<DirectusItem>>;
    createOne: (data: Partial<DirectusItem>) => Promise<DirectusResponse<DirectusItem>>;
    updateOne: (id: string | number, data: Partial<DirectusItem>) => Promise<DirectusResponse<DirectusItem>>;
    deleteOne: (id: string | number) => Promise<boolean>;
  };
}

const directus = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
}) as DirectusInstance;

export const handleDirectusError = (error: any): string => {
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
  createOne: async (formData: FormData): Promise<DirectusFile> => {
    const response: AxiosResponse<DirectusResponse<DirectusFile>> = await directus.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  readOne: async (fileId: string): Promise<DirectusFile> => {
    const response: AxiosResponse<DirectusResponse<DirectusFile>> = await directus.get(`/files/${fileId}`);
    return response.data.data;
  },
  deleteOne: async (fileId: string): Promise<boolean> => {
    await directus.delete(`/files/${fileId}`);
    return true;
  },
};

directus.items = (collection: string) => ({
  readByQuery: async (query: QueryParams = {}): Promise<DirectusResponse<DirectusItem[]>> => {
    const response: AxiosResponse<DirectusResponse<DirectusItem[]>> = await directus.get(`/items/${collection}`, { params: query });
    return response.data;
  },
  readOne: async (id: string | number): Promise<DirectusResponse<DirectusItem>> => {
    const response: AxiosResponse<DirectusResponse<DirectusItem>> = await directus.get(`/items/${collection}/${id}`);
    return response.data;
  },
  createOne: async (data: Partial<DirectusItem>): Promise<DirectusResponse<DirectusItem>> => {
    const response: AxiosResponse<DirectusResponse<DirectusItem>> = await directus.post(`/items/${collection}`, data);
    return response.data;
  },
  updateOne: async (id: string | number, data: Partial<DirectusItem>): Promise<DirectusResponse<DirectusItem>> => {
    const response: AxiosResponse<DirectusResponse<DirectusItem>> = await directus.patch(`/items/${collection}/${id}`, data);
    return response.data;
  },
  deleteOne: async (id: string | number): Promise<boolean> => {
    await directus.delete(`/items/${collection}/${id}`);
    return true;
  },
});

export default directus; 