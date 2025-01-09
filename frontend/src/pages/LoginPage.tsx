import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiLogin(email, password);

      if (response.success) {
        login(response.role);
        
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

  const apiLogin = async (email: string, password: string) => {
    const url = "https://925e09f3-068a-4a7c-b11b-c99dadb99083.mock.pstmn.io/api/login";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return {
        success: data.success,
        role: data.role,
      };
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };
  

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      ></div>
      <div className="w-full h-full absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-4 relative z-10"
        >
          <div className="bg-gray-800 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700">
            <h1 className="text-4xl font-bold mb-8 text-center text-white">Welcome Back</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute top-3 left-3 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-aqua-500 focus:border-aqua-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 text-gray-400 h-5 w-5" />
                  <Input
                    type="password"
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-aqua-500 focus:border-aqua-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}
              <Button
                type="submit"
                className="w-full bg-aqua-500 hover:bg-aqua-600 text-gray-900 font-semibold py-3 rounded-xl shadow-lg transition duration-200 flex items-center justify-center group"
              >
                <LogIn className="mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                Login
              </Button>
            </form>
            <div className="mt-8 text-center space-y-2">
              <a 
                href="#" 
                className="block text-sm text-gray-400 hover:text-aqua-400 transition duration-200"
              >
                Forgot password?
              </a>
              <p className="text-gray-400 text-sm">
                Please Contact the Administrator
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

