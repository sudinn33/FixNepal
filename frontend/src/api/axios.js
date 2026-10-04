import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isTokenUrl = original?.url?.includes('/token/');

    if (status === 401 && original && !original._retry && !isTokenUrl) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');

      if (refresh) {
        try {
          if (!refreshPromise) {
            refreshPromise = axios
              .post(`${API_URL}/token/refresh/`, { refresh })
              .finally(() => {
                refreshPromise = null;
              });
          }
          const { data } = await refreshPromise;
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch (refreshError) {
          // refresh token expired or invalid: fall through to logout
        }
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;