import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { getAccessToken } from "@/utils/auth";
import axiosInstance  from '../utils/authService'
// Define types
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void; // Updated to handle null case
  accessToken: string | null;
  refreshToken: string | null;
  login: (userDetails: UserDetails) => void;
  logout: () => void;
  updateUser: (userUpdates: Partial<User>) => void; // Added updateUser to the context value
  isLoading: boolean | null
}

interface User {
  employee_id: number;
  username: string;
  email: string;
  role: string;
  position: string;
  department: string;
  joined_date: string;
}

interface UserDetails {
  employee_id: number;
  username: string;
  email: string;
  role: string;
  position: string;
  department: string;
  joined_date: string;
  access_token: string;
  refresh_token: string;
}

// Default values for the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkAuthentication = async (): Promise<any> => {
    try {
      setIsLoading(true)
      const accessToken = getAccessToken()
      const baseUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${baseUrl}/api/token/validity-check/`,{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
      );
      console.log("authenticated", response.data.isAuthenticated)
      setIsAuthenticated(response.data.isAuthenticated);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    checkAuthentication()
  }, [])
  

  const [user, setUser] = useState<User | null>(() => {
    const userFromLocalStorage = localStorage.getItem("user");
    return userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refresh_token")
  );

  const login = (userDetails: UserDetails) => {
    setIsAuthenticated(true);
    setUser({
      employee_id: userDetails.employee_id,
      username: userDetails.username,
      email: userDetails.email,
      role: userDetails.role,
      position: userDetails.position,
      department: userDetails.department,
      joined_date: userDetails.joined_date,
    });
    setAccessToken(userDetails.access_token);
    setRefreshToken(userDetails.refresh_token);
    // Save tokens and user data to localStorage
    localStorage.setItem("access_token", userDetails.access_token);
    localStorage.setItem("refresh_token", userDetails.refresh_token);
    localStorage.setItem("user", JSON.stringify(userDetails));
    console.log(userDetails);
    
  };

  const logout = async () => {
    try {
        const refreshToken = localStorage.getItem("refresh_token");
        await axiosInstance.post('logout/', { refresh: refreshToken });
        //nsole.log("blacklisted")
        // Clear frontend state and storage
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
    } catch (err) {
        console.error("Error during logout:", err);
    }
};


  // Added updateUser to partially update user information
  const updateUser = (userUpdates: Partial<User>) => {
    setUser((prevUser) => {
      if (prevUser) {
        // Merging the previous user state with the updated fields
        const updatedUser = { ...prevUser, ...userUpdates };
        // Update user data in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      }
      return prevUser;
    });
  };


  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        setUser, // Added setUser to the context value
        updateUser,
        accessToken, 
        refreshToken, 
        login, 
        logout ,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("AuthContext is missing, ensure the component is wrapped with AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;