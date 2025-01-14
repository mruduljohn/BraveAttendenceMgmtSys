import { getRefreshToken, setAccessToken } from "./auth"; // Assume these are utility functions

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken(); // Retrieve refresh token from storage
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();
    setAccessToken(data.access_token); // Save the new access token to storage
    return data.access_token; // Return the new token
  } catch (error) {
    throw new Error("Token refresh failed");
  }
};
