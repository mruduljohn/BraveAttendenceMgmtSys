import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";  // To check if the user is authenticated

const EmployeeDashboard: React.FC = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  if (userRole !== "employee") {
    navigate("/");  // If the user is not an employee, redirect to login
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl">Welcome to Your Dashboard</h1>
      </header>
      <main className="flex-grow p-6">
        <h2 className="text-lg font-semibold mb-4">Attendance Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-medium">Clock In/Out</h3>
            <button
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded"
              onClick={() => navigate("/employee/clockin")}
            >
              Clock In / Out
            </button>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-medium">Attendance Records</h3>
            <button
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded"
              onClick={() => navigate("/employee/attendance")}
            >
              View Attendance Records
            </button>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-medium">Leave Requests</h3>
            <button
              className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded"
              onClick={() => navigate("/employee/leave-requests")}
            >
              Submit Leave Request
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <LogoutButton />
      </footer>
    </div>
  );
};

export default EmployeeDashboard;
