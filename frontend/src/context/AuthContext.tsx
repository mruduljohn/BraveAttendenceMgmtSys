import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // User object or null
  accessToken: string | null;
  refreshToken: string | null;
  login: (userDetails: UserDetails) => void;
  logout: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

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
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
