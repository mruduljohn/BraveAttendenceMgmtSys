import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming this is the authentication context

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth(); // This will get the authentication status

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login page if not authenticated
  }

  return <>{children}</>; // Render the protected route if authenticated
};

export default ProtectedRoute;
