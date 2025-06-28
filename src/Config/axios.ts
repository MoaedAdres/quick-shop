import { useAuthStore } from "@/Stores/auth.store";
import axios from "axios";
export const online = false;

const apiClient = axios.create({
  baseURL: online
    ? import.meta.env.VITE_BACKEND_CLIENT
    : import.meta.env.VITE_BACKEND_DEVLOPER,
  headers: {
    // Accept: "application/json",
    // "Content-Type": "application/json",
    "Accept-Language": localStorage.getItem("lang") ?? "en",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${useAuthStore.getState().token}`;
    config.headers["lang"] = localStorage.getItem("lang");
    // if (config.formData) {
    // 	config.data = ObjToFormData(config.data);
    // 	// Set Content-Type to undefined to let Axios set it automatically for FormData
    // 	delete config.headers["Content-Type"];
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // console.log("error.response", error.response.data);
      if (error.response.status === 401) {
      } else {
        // Handle other response errors
        console.error("Response error:", error.response);
      }
    } else if (error.request) {
      // Handle request error
      console.error("Request error:", error?.request);
    } else {
      // Handle other errors
      console.error("Error:", error.message);
    }
    return Promise.reject(error?.response?.data);
  }
);

const { get, post, put, patch, delete: destroy } = apiClient;
export { get, post, put, destroy, patch };

export default apiClient;
