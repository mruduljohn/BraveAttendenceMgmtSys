import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Clock, Calendar, FileCheck } from 'lucide-react';
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LiveTime from "@/components/LiveTime";
import axiosInstance  from '../utils/authService';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isClockedIn, setIsClockedIn] = useState(false);

  console.log("User in Dashboard ", user);

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {

        const response = await axiosInstance.get("/attendance/status/");
        setIsClockedIn(response.data.isClockedIn); 
        } 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (error: any) {
         
          if (error.response?.data?.messages?.[0]?.message === "Token is invalid or expired") {
            console.log("Error response body:", error.response?.data);
          } else {
            console.error("Error fetching attendance status:", error);
          }

        }
      };

    fetchAttendanceStatus();
  }, []);

  const handleClockInOut = async () => {
    const action = isClockedIn ? "clock_out" : "clock_in";
  
    try {
      const response = await axiosInstance.post("/attendance/clock_in_out/", {
        action
      });
  
    
      console.log(response.data.message);
      setIsClockedIn(response.data.isClockedIn);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during clock in/out:", error);
  
      // Handle specific errors based on the response
      if (error.response?.data?.error) {
        const errorMessage = error.response?.data?.error;
  
        if (errorMessage === "No clockout sessions!" || errorMessage === "clocked in already") {
          alert("Error: " + errorMessage);
          setIsClockedIn((prevState) => !prevState); 
        } else {
          alert("Failed: " + errorMessage || "Unknown error, please contact admin");
        }
      } else {
        alert("An error occurred while trying to clock in/out.");
      }
    }
  };
  

  const adminActions = [
    {
      title: "Manage Employees",
      description: "View, add, and manage employee information",
      icon: Users,
      href: "/admin/employees",
    },
  ];

  const personalActions = [
    {
      title: "Personal Attendance",
      description: "View your attendance history",
      icon: Calendar,
      buttonText: "View Attendance Records",
      href: "/admin/attendance",
    },
    {
      title: "Leave Requests",
      description: "Submit and manage leave requests",
      icon: FileCheck,
      buttonText: "Manage Leave Requests",
      href: "/admin/leave-requests",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      <header className="relative z-10 bg-slate-800/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogoutButton className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition-colors duration-200"/>
            </motion.div>
          </div>
        </div>
      </header>
    
      {/* Admin Profile and Clock In/Out Section */}
      <section className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {/* Admin Profile */}
          <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Admin Profile</h2>
            <div className="flex items-center gap-6">
              <img
                src={"https://mighty.tools/mockmind-api/content/cartoon/5.jpg"}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-amber-400"
              />
              <div>
                <h3 className="text-lg font-medium text-white">{user?.username}</h3>
                <p className="text-slate-400">Email: {user?.email}</p>
                <p className="text-slate-400">Position: {user?.position}</p>
                <p className="text-slate-400">Department: {user?.department}</p>
              </div>
            </div>
            {/* Edit Profile Button */}
            <div className="mt-4">
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate("/admin/edit-profile")}
              >
                Edit Admin Profile
              </Button>
            </div>
          </Card>

          {/* Clock In/Out Card */}
          <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-6 flex flex-col justify-between">
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-amber-400" />
              <h2 className="text-xl font-semibold mb-4 text-white">
                {isClockedIn ? "You are currently clocked in!" : "You are currently clocked out!"}
              </h2>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className={`w-full py-3 text-lg font-semibold ${
                  isClockedIn
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-slate-900 mb-4`}
                onClick={handleClockInOut}
              >
                {isClockedIn ? "Clock Out" : "Clock In"}
              </Button>
            </motion.div>
          </Card>
        </div>
      </section>

      <main className="relative z-10 flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
          <h2 className="text-xl font-semibold mb-6 text-white/90">Admin Actions</h2>
          <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-1 gap-6"
          >
        {adminActions.map((action, index) => (
          <motion.div key={index} variants={itemVariants}>
        <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-lg border-slate-700 hover:bg-slate-700/50 transition-colors duration-300 h-64">
          <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-slate-700/50">
          <action.icon className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-medium text-white">{action.title}</h3>
          </div>
          <p className="text-slate-300 mb-6">{action.description}</p>
        </div>
        <Button
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => navigate(action.href)}
        >
          {action.title}
        </Button>
          </div>
        </Card>
          </motion.div>
        ))}
          </motion.div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6 text-white/90">Personal Actions</h2>
          <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
        {personalActions.map((action, index) => (
          <motion.div key={index} variants={itemVariants}>
        <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-lg border-slate-700 hover:bg-slate-700/50 transition-colors duration-300 h-64">
          <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-slate-700/50">
          <action.icon className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-medium text-white">{action.title}</h3>
          </div>
          <p className="text-slate-300 mb-6">{action.description}</p>
        </div>
        <Button
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => navigate(action.href)}
        >
          {action.buttonText}
        </Button>
          </div>
        </Card>
          </motion.div>
        ))}
          </motion.div>
        </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 bg-slate-800/50 backdrop-blur-lg border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-slate-400">
          <LiveTime />
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
