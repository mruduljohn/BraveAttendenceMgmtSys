import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeClockInPage from "./pages/EmployeeClockInPage";
import AttendanceRecordsPage from "./pages/EmployeeAttendanceRecordsPage";
import LeaveRequestsPage from "./pages/EmployeeLeaveRequestsPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Employee-specific routes */}
          <Route
            path="/employee/clockin"
            element={
              <ProtectedRoute>
                <EmployeeClockInPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute>
                <AttendanceRecordsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave-requests"
            element={
              <ProtectedRoute>
                <LeaveRequestsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
