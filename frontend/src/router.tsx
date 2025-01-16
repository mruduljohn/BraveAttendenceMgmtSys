import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ClockInPage from "./pages/ClockInPage";
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
import ManageReportGeneration from "./pages/ManagerReportGeneration";
import AdminEmployeeForm from "./pages/AdminEmployeeForm";
import PageNotFound from "./pages/PageNotFound";
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
                  <Route path="clockin" element={<ClockInPage />} />
                  <Route path="attendance" element={<EmployeeAttendanceRecordsPage />} />
                  <Route path="leave-requests" element={<EmployeeLeaveRequestsPage />} />
                  <Route path="edit-profile" element={<EmployeeEditProfilePage />} />
                  <Route path="*" element={<PageNotFound />} />
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
                  <Route path="employee/create" element={<AdminEmployeeForm />} />
                  <Route path="employee/edit/:id" element={<AdminEmployeeForm />} />
                  <Route path="clockin" element={<ClockInPage />} />
                  <Route path="attendance" element={<AdminAttendanceRecordsPage />} />
                  <Route path="leave-requests" element={<AdminLeaveRequestsPage />} />
                  <Route path="edit-profile" element={<AdminEditProfilePage />} />
                  <Route path="*" element={<PageNotFound />} />
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
                  <Route path="clockin" element={<ClockInPage />} />
                  <Route path="attendance" element={<ManagerAttendanceRecordsPage />} />
                  <Route path="leave-approvals" element={<ManagerLeaveApprovalPage />} />
                  <Route path="edit-profile" element={<ManagerEditProfilePage />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
