import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const refreshAccessToken = async () => {
  try {
    const response = await axios.post("/api/token/refresh/", {
      refresh: localStorage.getItem("refreshToken"),
    });
    localStorage.setItem("accessToken", response.data.access);
    return response.data.access;
  } catch (err) {
    console.error("Failed to refresh token", err);
    localStorage.removeItem("refreshToken");
    const navigate = useNavigate();
    navigate("/login");
  }
};

export default refreshAccessToken;
