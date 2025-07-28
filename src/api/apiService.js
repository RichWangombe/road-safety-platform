import axios from 'axios';


// Create an Axios instance with a base URL
const apiConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
};

// In Jest (jsdom) environment, Axios defaults to an adapter array [ 'xhr', 'http', 'fetch' ].
// This causes Axios to fall back to the XHR adapter (because window is defined) which MSW/node cannot intercept.
// Force Axios to use the dedicated Node HTTP adapter when running unit tests so that MSW's server can handle requests.
if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line global-require
  const requiredAdapter = require('axios/lib/adapters/http');
  apiConfig.adapter = requiredAdapter.default ? requiredAdapter.default : requiredAdapter;
}



const apiService = axios.create(apiConfig);

// Add a request interceptor to include the token
if (apiService.interceptors && process.env.NODE_ENV !== 'test') {
  apiService.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export const fetchStakeholders = async () => {
  try {
    const response = await apiService.get('/v1/stakeholders');
    return response.data;
  } catch (error) {
    // It's good practice to log the original error for debugging
    console.error('Failed to fetch stakeholders:', error);
    // Throw a new error with a message that the UI can use
    throw new Error('Failed to fetch stakeholders');
  }
};

export const fetchPrograms = async () => {
  const response = await apiService.get('/v1/programs');
  return response.data;
};

export const fetchActivities = async () => {
  const response = await apiService.get('/v1/activities');
  return response.data;
};

export const fetchTasks = async () => {
  const response = await apiService.get('/v1/tasks');
  return response.data;
};

export default apiService;
