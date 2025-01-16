import axios from "axios";

const BASE_URL = "http://15.206.69.241:8000/api/";
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${BASE_URL}/token/refresh/`, {
                        refresh: refreshToken,
                    });
                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("refresh_token", data.refresh);

                    axiosInstance.defaults.headers.Authorization = `Bearer ${data.access}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token is invalid or expired");
                    localStorage.clear();
                    window.location.href = "/";
                }
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;
