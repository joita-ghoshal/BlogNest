import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('blognest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong';

    if (status === 401) {
      sessionStorage.removeItem('blognest_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error(message || 'Access denied');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (status && status !== 404) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
