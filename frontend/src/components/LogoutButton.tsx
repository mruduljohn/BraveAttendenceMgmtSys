import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


interface LogoutButtonProps {
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-500 text-white py-2 px-4 rounded ${className}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;