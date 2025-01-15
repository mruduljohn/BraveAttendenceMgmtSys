import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { FileText, Download, Calendar, ArrowLeft } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LiveTime from "@/components/LiveTime";
import { useAuth } from "../context/AuthContext";
import { log } from 'console';

interface EmployeeReport {
  name: string;
  position: string;
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  overtimeHours: number;
}

const ManagerReportGeneration: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [report, setReport] = useState<EmployeeReport[]>([]);
  const { user } = useAuth();

  // if (!["Manager"].includes(user?.role)) {
  //   navigate("/"); // Redirect if user is not allowed
  // }

  // Function to get the access token from local storage

  const months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

  const generateReport = async () => {
    if (!selectedMonth) {
      alert("Please select a month first!");
      return;
    }

    // Find the selected month's numeric value
    const selectedMonthObj = months.find(m => m.name === selectedMonth);
    const monthValue = selectedMonthObj?.value;

    if (!monthValue) {
      alert("Invalid month selected.");
      return;
    }

   

    // Make the API request to generate the report
    try {
      const response = await fetch(`http://localhost:8000/api/generate_reports/${monthValue}/`, {
  
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Unknown error occurred please try again or contact admin";
        alert(errorMessage);
        return;
      }

      const data = await response.json();
       //console.log('Data',data.report);

      
      const formattedReport = data.report.map((emp: any) => ({
        name: emp.employee_name, 
        position: emp.position,
        totalWorkingDays: emp.total_days,
        daysPresent: emp.days_present, 
        daysAbsent: emp.days_absent, 
        overtimeHours: emp.total_overtime_hours, 
      }));
      setReport(formattedReport); 
      
    } catch (error) {
      console.error("Error fetching report:", error);
      alert("An error occurred while generating the report. Please try again.");
    }
  };

  const downloadReport = () => {
    const headers = "Employee Name,Position,Total Working Days,Days Present,Days Absent,Overtime Hours\n";
    const csvContent = report.map(emp => 
      `${emp.name},${emp.position},${emp.totalWorkingDays},${emp.daysPresent},${emp.daysAbsent},${emp.overtimeHours}`
    ).join("\n");

    const element = document.createElement("a");
    const file = new Blob([headers + csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `team_attendance_report_${selectedMonth}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-300 hover:text-white"
                  onClick={() => navigate("/manager/dashboard")}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </motion.div>
              <h1 className="text-2xl font-bold text-white">Generate Team Attendance Report</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <Card className="bg-slate-800/50 backdrop-blur-lg border-blue-700 p-6">
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center gap-4">
              <Select onValueChange={setSelectedMonth} value={selectedMonth}>
                <SelectTrigger className="w-[180px] bg-slate-700 border-blue-600 text-white">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.name}> {/* Using month.name as text */}
                      {month.name} {/* Displaying month name */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

                <Button
                  onClick={generateReport}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={!selectedMonth}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Report
                </Button>
              </div>
            </motion.div>

            {report.length > 0 && (
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold text-white mb-4">Team Attendance Report for {selectedMonth}</h3>
                <div className="bg-slate-700/50 rounded-lg mb-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-300">Employee Name</TableHead>
                        <TableHead className="text-slate-300">Position</TableHead>
                        <TableHead className="text-slate-300">Total Working Days</TableHead>
                        <TableHead className="text-slate-300">Days Present</TableHead>
                        <TableHead className="text-slate-300">Days Absent</TableHead>
                        <TableHead className="text-slate-300">Overtime Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      
                      {report.map((employee, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-white">{employee.name}</TableCell>
                          <TableCell className="text-slate-300">{employee.position}</TableCell>
                          <TableCell className="text-slate-300">{employee.totalWorkingDays}</TableCell>
                          <TableCell className="text-slate-300">{employee.daysPresent}</TableCell>
                          <TableCell className="text-slate-300">{employee.daysAbsent}</TableCell>
                          <TableCell className="text-slate-300">{employee.overtimeHours}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  onClick={downloadReport}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Team Report (CSV)
                </Button>
              </motion.div>
            )}
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
}

export default ManagerReportGeneration;