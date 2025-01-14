
export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token");
  };
  
  // Function to set the access token in local storage
  export const setAccessToken = (token: string): void => {
    localStorage.setItem("access_token", token);
  };
  
  // Function to get the refresh token from local storage
  export const getRefreshToken = (): string | null => {
    return localStorage.getItem("refresh_token");
  };
  
  // Function to set the refresh token in local storage
  export const setRefreshToken = (token: string): void => {
    localStorage.setItem("refresh_token", token);
  };
  