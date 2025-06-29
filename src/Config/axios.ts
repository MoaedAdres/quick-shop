import axios from "axios";

// Replace this URL when backend is deployed
const API_BASE_URL = 'https://your-backend-url.com'; // TODO: Replace with actual backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add telegram_id to all requests
api.interceptors.request.use(
  (config) => {
    // Get telegram_id from localStorage or auth store
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.state?.user?.id) {
          config.headers['telegram_id'] = parsed.state.user.id;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

const { get, post, put, patch, delete: destroy } = api;
export { get, post, put, destroy, patch };

export default api;
