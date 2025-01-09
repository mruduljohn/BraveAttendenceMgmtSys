import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // User is either a user object or null
  login: (role: string) => void;
  logout: () => void;
}

interface User {
  role: string;
}

// Default values for the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (role: string) => {
    setIsAuthenticated(true);
    setUser({ role }); // Set the user with a role
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null); // Clear the user on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
