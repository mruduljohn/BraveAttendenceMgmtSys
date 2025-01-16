import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, TrendingUp, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LiveTime from "@/components/LiveTime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceRecord {
  date: string;
  attendance_id: string;
  total_hours: number;
  extra_hours: number;
  status: "Open" | "Closed";
}

interface GroupedAttendanceRecord {
  date: string;
  total_hours: number;
  extra_hours: number;
  status: "Open" | "Closed";
  entries: AttendanceRecord[];
}

const STANDARD_WORK_HOURS = 7; // Define standard work hours

const PersonalAttendanceRecordsPage: React.FC = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState<GroupedAttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${baseUrl}/api/fetch_attendance/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance records");
        }

        const data: AttendanceRecord[] = await response.json();
        
        // Group and sum the records by date
        const groupedData = data.reduce((acc: { [key: string]: GroupedAttendanceRecord }, record) => {
          if (!acc[record.date]) {
            acc[record.date] = {
              date: record.date,
              total_hours: 0,
              extra_hours: 0,
              status: record.status,
              entries: [],
            };
          }
          acc[record.date].total_hours += record.total_hours;
          acc[record.date].entries.push(record);
          return acc;
        }, {});

        // Calculate extra hours for each grouped record
        Object.values(groupedData).forEach(record => {
          record.extra_hours = Math.max(0, record.total_hours - STANDARD_WORK_HOURS);
        });

        const sortedGroupedData = Object.values(groupedData).sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setAttendanceRecords(sortedGroupedData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user, navigate, accessToken]);

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

  // Calculate total hours worked in the current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const totalHoursThisMonth = attendanceRecords
    .filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    })
    .reduce((total, record) => total + record.total_hours, 0);

  // Calculate average hours per day
  const averageHoursPerDay = attendanceRecords.length > 0
    ? attendanceRecords.reduce((total, record) => total + record.total_hours, 0) / attendanceRecords.length
    : 0;

  // Prepare data for the line chart
  const chartData = attendanceRecords
    .slice(-30)
    .map(record => ({
      date: record.date,
      hours: record.total_hours,
    }))
    .reverse();

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
            <h1 className="text-2xl font-bold text-white">Personal Attendance Records</h1>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-300 hover:text-white"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
              </motion.div>
              <LogoutButton className="bg-blue-700/50 hover:bg-blue-600/50 text-white transition-colors duration-200" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-6"
        >
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 backdrop-blur-lg border-blue-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Total Hours This Month</CardTitle>
                    <Clock className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{totalHoursThisMonth.toFixed(2)}</div>
                    <p className="text-xs text-slate-400">hours</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 backdrop-blur-lg border-blue-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Average Hours Per Day</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{averageHoursPerDay.toFixed(2)}</div>
                    <p className="text-xs text-slate-400">hours</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 backdrop-blur-lg border-blue-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Total Records</CardTitle>
                    <Users className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{attendanceRecords.length}</div>
                    <p className="text-xs text-slate-400">entries</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-800/50 backdrop-blur-lg border-blue-700 p-6">
                <CardTitle className="text-xl font-bold text-white mb-4">Attendance Trend (Last 30 Days)</CardTitle>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                        labelStyle={{ color: '#D1D5DB' }}
                        itemStyle={{ color: '#60A5FA' }}
                      />
                      <Line type="monotone" dataKey="hours" stroke="#60A5FA" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-lg border-blue-700 overflow-hidden">
                <CardTitle className="text-xl font-bold text-white p-6">Detailed Records</CardTitle>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Total Hours</TableHead>
                      <TableHead className="text-slate-300">Extra Hours</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {attendanceRecords.map((record, index) => (
                      <motion.tr key={index} variants={itemVariants}>
                        <TableCell className="text-slate-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-green-400" />
                            {record.date}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{record.total_hours.toFixed(2)}</TableCell>
                        <TableCell className="text-slate-300">{record.extra_hours.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {record.status === "Open" ? (
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-2 text-red-500" />
                            )}
                            <span className={record.status === "Open" ? "text-green-500" : "text-red-500"}>
                              {record.status}
                            </span>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </>
          )}
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

export default PersonalAttendanceRecordsPage;