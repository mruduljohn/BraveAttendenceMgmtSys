import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Add other routes as you build */}
        <Route path="/employee/dashboard" element={<h1>Employee Dashboard</h1>} />
        <Route path="/manager/dashboard" element={<h1>Manager Dashboard</h1>} />
        <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
