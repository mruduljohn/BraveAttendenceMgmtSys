import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Calendar, FileText, LogOut } from 'lucide-react';
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LiveTime from "@/components/LiveTime";

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log("User in Dashboard ", user);

  // Protect the route
  useEffect(() => {
    if (!user || user.role !== "employee") {
      navigate("/");
    }
  }, [user, navigate]);

  const cards = [
    {
      title: "Clock In/Out",
      description: "Record your daily attendance",
      icon: Clock,
      buttonText: "Clock In / Out",
      href: "/employee/clockin",
    },
    {
      title: "Attendance Records",
      description: "View your attendance history",
      icon: Calendar,
      buttonText: "View Attendance Records",
      href: "/employee/attendance",
    },
    {
      title: "Leave Requests",
      description: "Submit and manage leave requests",
      icon: FileText,
      buttonText: "Submit Leave Request",
      href: "/employee/leave-requests",
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

  // Return null if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      <header className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Welcome to Your Dashboard</h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogoutButton className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-white transition-colors duration-200">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </LogoutButton>
            </motion.div>
          </div>
        </div>
      </header>
    
      {/* Employee Profile Section */}
      <section className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
          <div className="flex items-center gap-6">
            <img
              src={"https://dev.quantumcloud.com/simple-business-directory/wp-content/uploads/2018/01/brianjohnsrud.jpg"}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-aqua-400"
            />
            <div>
              <h3 className="text-lg font-medium text-white">{user.username}</h3>
              <p className="text-gray-400">Email: {user.email}</p>
              <p className="text-gray-400">Position: {user.position}</p>
              <p className="text-gray-400">Department: {user.department}</p>
            </div>
          </div>
          {/* Edit Profile Button */}
          <div className="mt-4">
            <Button
              className="w-full bg-aqua-500 hover:bg-aqua-600 text-gray-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => navigate("/employee/edit-profile")}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </section>

      <main className="relative z-10 flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-white/90">Attendance Management</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {cards.map((card, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="relative overflow-hidden bg-gray-800/50 backdrop-blur-lg border-gray-700 hover:bg-gray-700/50 transition-colors duration-300">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-lg bg-gray-700/50">
                        <card.icon className="w-6 h-6 text-aqua-400" />
                      </div>
                      <h3 className="text-xl font-medium text-white">{card.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-6">{card.description}</p>
                    <Button
                      className="w-full bg-aqua-500 hover:bg-aqua-600 text-gray-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => navigate(card.href)}
                    >
                      {card.buttonText}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-400">
          <LiveTime />
        </div>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;