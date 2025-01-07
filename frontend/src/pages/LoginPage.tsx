import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // Import the useAuth hook

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();  // Access login function from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Replace this with a real API call
      const response = await fakeLogin(email, password);

      if (response.success) {
        // Log in the user
        login(response.role);
        
        // Redirect based on role
        if (response.role === "admin") navigate("/admin/dashboard");
        else if (response.role === "manager") navigate("/manager/dashboard");
        else navigate("/employee/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  // Mock Login API Function
  const fakeLogin = (email: string, password: string) => {
    return new Promise<{ success: boolean; role: string }>((resolve) => {
      setTimeout(() => {
        if (email === "admin@test.com" && password === "admin123") {
          resolve({ success: true, role: "admin" });
        } else if (email === "manager@test.com" && password === "manager123") {
          resolve({ success: true, role: "manager" });
        } else if (email === "employee@test.com" && password === "employee123") {
          resolve({ success: true, role: "employee" });
        } else {
          resolve({ success: false, role: "" });
        }
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
