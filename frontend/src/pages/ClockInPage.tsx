import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LiveTime from "@/components/LiveTime";

const ClockInPage: React.FC = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // if (!["Manager", "Admin", "Employee"].includes(user?.role)) {
  //   navigate("/"); // Redirect if user is not allowed
  // }
  

  useEffect(() => {
    console.log("useEffect triggered");
    const fetchAttendanceStatus = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${baseUrl}/api/attendance/status/`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // console.log('Parsed response data:', data.isClockedIn);
          setIsClockedIn(data.isClockedIn)
        } else {

          const errorData = await response.json();
          if( errorData.messages[0].message === "Token is invalid or expired")
          console.log('Error response body:', errorData);
        }
      } catch (error) {
        console.error('Error fetching attendance status:', error);
      }
    };

    fetchAttendanceStatus();
  }, []); // Dependency array ensures it runs only once on mount


  const handleClockInOut = async () => {
    const action = isClockedIn ? "clock_out" : "clock_in";

    try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${baseUrl}/api/attendance/clock_in_out/`,{
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

            // // Check if the token is invalid or expired and redirect to login
            // if (errorData.messages && errorData.messages[0]?.message === "Token is invalid or expired") {
            //     alert("Your session has expired. Please log in again.");
            //     navigate("/");
            //     return; 
            // }

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


  const handleViewTeamClockIns = () => {
    // Navigate to a page where manager can view team clock-ins
    //check user role and use conditional rendering
    if (user?.role === "Manager") {
      navigate("/manager/team-clock-ins");
    }
    if (user?.role === "Admin") {
      navigate("/admin/team-clock-ins");
    }
    if (user?.role === "Employee") {
      navigate("/employee/team-clock-ins");
    }
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
            <h1 className="text-2xl font-bold text-white">Clock In / Out</h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-slate-300 hover:text-black"
                onClick={() => navigate(`/${user?.role?.toLowerCase()}/dashboard`)}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>

            </motion.div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-800/50 backdrop-blur-lg border-blue-700 p-8">
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h2 className="text-2xl font-semibold mb-6 text-white">
                {isClockedIn ? "You are currently clocked in!" : "You are currently clocked out!"}
              </h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className={`w-full py-3 text-lg font-semibold ${isClockedIn
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                    } text-slate-900 mb-4`}
                  onClick={handleClockInOut}
                >
                  {isClockedIn ? "Clock Out" : "Clock In"}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleViewTeamClockIns}
                >
                  <Users className="w-5 h-5 mr-2" />
                  View Team Clock-ins
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </main>

      <footer className="relative z-10 bg-slate-800/50 backdrop-blur-lg border-t border-blue-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-slate-400">
          <LiveTime />
        </div>
      </footer>
    </div>
  );
};

export default ClockInPage;
