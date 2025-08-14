import axios from "axios";

// Replace this URL when backend is deployed
const API_BASE_URL = "https://hashbel.io/api/v1/"; // TODO: Replace with actual backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
const constantToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MjMzNTM3LCJpYXQiOjE3NTUxNDcxMzcsImp0aSI6IjgyYjNhMGEzNWY1ZTRhZTdhNDhjYWE5ZWM0NmVjMDIwIiwidXNlcl9pZCI6NH0.VzgP8JdjF1EslkDNHnNghHBwJI057aapRSQH7z_rpVI";
// Request interceptor to add authentication token to all requests
api.interceptors.request.use(
  (config) => {
    // Skip Authorization header for telegramLogin requests
    if (config.url?.includes("telegram-login")) {
      return config;
    }

    // Get auth data from localStorage
    const authData = localStorage.getItem("auth-storage");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);

        // Add access token if available
        // if (parsed.state?.token) {
        config.headers["Authorization"] = `Bearer ${constantToken}`;
        // }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from localStorage
        const authData = localStorage.getItem("auth-storage");
        if (authData) {
          const parsed = JSON.parse(authData);
          const refreshToken = parsed.state?.refreshToken;

          if (refreshToken) {
            // Import the refresh token API call
            const { backApis } = await import("@/Api/endpoints");
            const response = await backApis.refreshToken({
              refresh: refreshToken,
            });

            // Update stored tokens
            const newAuthData = {
              ...parsed,
              state: {
                ...parsed.state,
                token: response.data.access,
                refreshToken: response.data.refresh,
              },
            };
            localStorage.setItem("auth-storage", JSON.stringify(newAuthData));

            // Retry the original request with new token
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${response.data.access}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear auth data and redirect to login
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
      }
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const { get, post, put, patch, delete: destroy } = api;
export { get, post, put, destroy, patch };

export default api;
