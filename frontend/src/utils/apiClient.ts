import axios from "axios";
import { getAccessToken, setAccessToken } from "./auth"; // Assume these are utility functions to get/set tokens.
import { refreshAccessToken } from "./authService"; // Service to refresh token

const apiClient = axios.create({
  baseURL: "http://15.206.69.241:8000/api/", // Replace with your API base URL
});

// Add a request interceptor to add the token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = getAccessToken(); // Retrieve the current access token from storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => response, // Return response as is if everything is fine
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      // If unauthorized (401) and request has not been retried
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken(); // Call your refresh token logic here
        setAccessToken(newToken); // Store the new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`; // Retry the original request with the new token
        return apiClient(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Handle refresh token failure (e.g., log out the user)
        console.error("Token refresh failed", refreshError);
        // Optional: redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
