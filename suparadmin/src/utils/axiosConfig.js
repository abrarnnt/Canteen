import axios from "axios";

// Helper to get the API base URL
const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  if (import.meta.env.DEV) {
    console.log('API Base URL:', url);
  }
  return url;
};

// Create an axios instance with custom config
const instance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Handle FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']; // Let browser set it
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (import.meta.env.DEV) {
      console.log(`API Response [${response.status}]:`, {
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }

    // Handle token expiration
    if (error.response?.status === 401 && 
        error.response?.data?.error === 'Token expired') {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject({
        message: 'Your session has expired. Please log in again.'
      });
    }

    // Handle CORS errors
    if (error.message?.includes('Network Error') || !error.response) {
      console.error('Network/CORS Error:', error);
      return Promise.reject({
        message: 'Unable to connect to the server. Please check your connection.'
      });
    }

    // Handle other errors
    return Promise.reject({
      message: error.response?.data?.message || 'An unexpected error occurred',
      error: error.response?.data?.error,
      status: error.response?.status
    });
  }
);

export default instance;
