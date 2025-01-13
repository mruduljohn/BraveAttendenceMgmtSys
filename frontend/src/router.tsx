import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeClockInPage from "./pages/EmployeeClockInPage";
import AdminClockInPage from "./pages/AdminClockInPage";
import ManagerClockInPage from "./pages/ManagerClockInPage";
import EmployeeAttendanceRecordsPage from "./pages/EmployeeAttendanceRecordsPage";
import AdminAttendanceRecordsPage from "./pages/AdminAttendanceRecordsPage";
import ManagerAttendanceRecordsPage from "./pages/ManagerAttendanceRecordsPage";
import EmployeeLeaveRequestsPage from "./pages/EmployeeLeaveRequestsPage";
import AdminLeaveRequestsPage from "./pages/AdminLeaveRequestsPage";
import ManagerLeaveApprovalPage from "./pages/ManagerLeaveApprovalPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeEditProfilePage from "./pages/EmployeeEditProfilePage";
import AdminEditProfilePage from "./pages/AdminEditProfilePage";
import ManagerEditProfilePage from "./pages/ManagerEditProfilePage";
import AdminEmployeeManagement from "./pages/AdminEmployeeManagement";
import ManagerEmployeeManagement from "./pages/ManagerEmployeeManagement";
// import AdminReportGeneration from "./pages/AdminReportGeneration";
import ManageReportGeneration from "./pages/ManagerReportGeneration";
import AdminEmployeeForm from "./pages/AdminEmployeeForm";
// import ManagerEmployeeForm from "./pages/ManagerEmployeeForm";
import ManagerAnalysisPage from "./pages/ManagerAnalysisPage";

import { useAuth } from "./context/AuthContext";

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Employee-specific routes */}
          <Route
            path="/employee/*"
            element={
              <ProtectedRoute allowedRoles={['Employee']}>
                <Routes>
                  <Route path="dashboard" element={<EmployeeDashboard />} />
                  <Route path="clockin" element={<EmployeeClockInPage />} />
                  <Route path="attendance" element={<EmployeeAttendanceRecordsPage />} />
                  <Route path="leave-requests" element={<EmployeeLeaveRequestsPage />} />
                  <Route path="edit-profile" element={<EmployeeEditProfilePage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Admin-specific routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="employees" element={<AdminEmployeeManagement />} />
                  {/* <Route path="reports" element={<AdminReportGeneration />} /> */}
                  <Route path="employee/create" element={<AdminEmployeeForm />} />
                  <Route path="employee/edit/:id" element={<AdminEmployeeForm />} />
                  <Route path="clockin" element={<AdminClockInPage />} />
                  <Route path="attendance" element={<AdminAttendanceRecordsPage />} />
                  <Route path="leave-requests" element={<AdminLeaveRequestsPage />} />
                  <Route path="edit-profile" element={<AdminEditProfilePage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Manager-specific routes */}
          <Route
            path="/manager/*"
            element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <Routes>
                  <Route path="dashboard" element={<ManagerDashboard />} />
                  <Route path="employees" element={<ManagerEmployeeManagement />} />
                  <Route path="reports" element={<ManageReportGeneration />} />
                  {/* <Route path="employee/create" element={<ManagerEmployeeForm />} />
                  <Route path="employee/edit/:id" element={<ManagerEmployeeForm />} /> */}
                  <Route path="clockin" element={<ManagerClockInPage />} />
                  <Route path="attendance" element={<ManagerAttendanceRecordsPage />} />
                  <Route path="leave-approvals" element={<ManagerLeaveApprovalPage />} />
                  <Route path="edit-profile" element={<ManagerEditProfilePage />} />
                  <Route path="analytics" element={<ManagerAnalysisPage/>} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
