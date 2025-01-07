import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";

const AttendanceRecordsPage: React.FC = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the attendance records from the API
    const fetchAttendance = async () => {
      // Example fetch - this should be replaced with actual API call
      setAttendanceRecords([
        { date: "2025-01-01", status: "Present" },
        { date: "2025-01-02", status: "Absent" },
        // Add more records
      ]);
    };
    
    fetchAttendance();
  }, []);

  if (userRole !== "employee") {
    navigate("/"); // Redirect if user is not an employee
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl">Attendance Records</h1>
      </header>
      <main className="flex-grow p-6">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{record.date}</td>
                <td className="py-2 px-4 border-b">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <LogoutButton />
      </footer>
    </div>
  );
};

export default AttendanceRecordsPage;
