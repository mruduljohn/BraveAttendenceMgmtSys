import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, FileText, LogOut, BarChart, Clock, Calendar, FileCheck, UserCheck, PieChart } from 'lucide-react';
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LiveTime from "@/components/LiveTime";

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isClockedIn, setIsClockedIn] = useState(false);

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/attendance/status/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsClockedIn(data.isClockedIn)
        } else {
          const errorData = await response.json();
          if (errorData.messages[0].message === "Token is invalid or expired")
            console.log('Error response body:', errorData);
        }
      } catch (error) {
        console.error('Error fetching attendance status:', error);
      }
    };

    fetchAttendanceStatus();
  }, []);

  const handleClockInOut = async () => {
    const action = isClockedIn ? "clock_out" : "clock_in";

    try {
      const response = await fetch("http://localhost:8000/api/attendance/clock_in_out/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setIsClockedIn(data.isClockedIn);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);

        if (errorData.error === "No clockout sessions!" || errorData.error === "clocked in already") {
          alert("Error: " + errorData.error);
          setIsClockedIn((prevState) => !prevState);
        } else {
          alert("Failed: " + (errorData.error || "Unknown error, please contact admin"));
        }
      }
    } catch (error) {
      console.error("Error during clock in/out:", error);
      alert("An error occurred while trying to clock in/out.");
    }
  };

  const managerActions = [
    {
      title: "Manage Team",
      description: "View and manage your team members",
      icon: Users,
      href: "/manager/employees",
    },
    {
      title: "Generate Reports",
      description: "Create and view various reports",
      icon: FileText,
      href: "/manager/reports",
    },
    {
      title: "Leave Requests Approval",
      description: "Review and approve team leave requests",
      icon: UserCheck,
      href: "/manager/leave-approvals",
    },
  ];

  const personalActions = [
    {
      title: "Personal Attendance",
      description: "View your attendance history",
      icon: Calendar,
      buttonText: "View Attendance Records",
      href: "/manager/attendance",
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      <header className="relative z-10 bg-slate-800/50 backdrop-blur-lg border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Manager Dashboard</h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogoutButton className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700/50 hover:bg-blue-600/50 text-white transition-colors duration-200">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </LogoutButton>
            </motion.div>
          </div>
        </div>
      </header>
    
     {/* Manager Profile and Clock In/Out Section */}
     <section className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* Manager Profile */}
          <Card className="col-span-2 bg-slate-800/50 backdrop-blur-lg border border-blue-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Manager Profile</h2>
            <div className="flex items-center gap-6">
              <img
                src={"https://mighty.tools/mockmind-api/content/cartoon/9.jpg"}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-green-400"
              />
              <div>
                <h3 className="text-lg font-medium text-white">{user?.username}</h3>
                <p className="text-blue-300">Email: {user?.email}</p>
                <p className="text-blue-300">Position: {user?.position}</p>
                <p className="text-blue-300">Department: {user?.department}</p>
              </div>
            </div>
            {/* Edit Profile Button */}
            <div className="mt-4">
              <Button
                className="w-full bg-white hover:bg-green-300 text-blue-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate("/manager/edit-profile")}
              >
                Edit Manager Profile
              </Button>
            </div>
          </Card>

          {/* Clock In/Out Card */}
          <Card className="bg-slate-800/50 backdrop-blur-lg border border-blue-700 rounded-lg p-6 flex flex-col justify-between">
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-green-400" />
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
          <h2 className="text-xl font-semibold mb-6 text-white/90">Manager Actions</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {managerActions.map((action, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-lg border-blue-700 hover:bg-blue-700/50 transition-colors duration-300">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-lg bg-blue-700/50">
                        <action.icon className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="text-xl font-medium text-white">{action.title}</h3>
                    </div>
                    <p className="text-blue-300 mb-6">{action.description}</p>
                    <Button
                      className="w-full bg-white hover:bg-green-300 text-blue-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => navigate(action.href)}
                    >
                      {action.title}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <h2 className="text-xl font-semibold my-6 text-white/90">Personal Actions</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {personalActions.map((action, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="relative overflow-hidden bg-blue-800/50 backdrop-blur-lg border-blue-700 hover:bg-blue-700/50 transition-colors duration-300">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-lg bg-blue-700/50">
                        <action.icon className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="text-xl font-medium text-white">{action.title}</h3>
                    </div>
                    <p className="text-blue-300 mb-6">{action.description}</p>
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600 text-blue-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
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
      </main>

      <footer className="relative z-10 bg-black-800/50 backdrop-blur-lg border-t border-green-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-blue-400">
          <LiveTime />  
        </div>
      </footer>
    </div>
  );
};

export default ManagerDashboard;