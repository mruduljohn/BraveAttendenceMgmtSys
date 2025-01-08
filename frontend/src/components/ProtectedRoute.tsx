import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming this is the authentication context

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth(); // This will get the authentication status and user info

  if (!isAuthenticated || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect to login page if not authenticated or role not allowed
  }

  return <>{children}</>; // Render the protected route if authenticated and role is allowed
};

export default ProtectedRoute;