import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ClockInPage: React.FC = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const navigate = useNavigate();
  const { userRole } = useAuth();

  if (userRole !== "employee") {
    navigate("/"); // Redirect if user is not an employee
  }

  const handleClockInOut = () => {
    // This should ideally call the backend to clock in/out
    setIsClockedIn((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Clock In / Out</h1>
        <div className="text-center">
          <h2 className="text-xl mb-4">
            {isClockedIn ? "You are currently clocked in!" : "You are currently clocked out!"}
          </h2>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded"
            onClick={handleClockInOut}
          >
            {isClockedIn ? "Clock Out" : "Clock In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClockInPage;
