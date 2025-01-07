import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

const LeaveRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    // Fetch the leave requests from the backend API
    // Here, you would make an actual API call to your backend to fetch leave requests
    // For now, we'll use a static example
    setLeaveRequests([
      {
        id: 1,
        startDate: "2025-01-15",
        endDate: "2025-01-18",
        reason: "Vacation",
        status: "Pending",
      },
      {
        id: 2,
        startDate: "2025-02-01",
        endDate: "2025-02-02",
        reason: "Sick leave",
        status: "Approved",
      },
    ]);
  }, []);

  const handleLeaveRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the submission of the new leave request
    // You should make an API call to submit the leave request to the backend
    console.log("Leave request submitted", newLeaveRequest);

    // After submission, you could clear the form or show a success message
    setNewLeaveRequest({ startDate: "", endDate: "", reason: "" });
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
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      <header className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Leave Requests</h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-300 hover:text-white"
                onClick={() => navigate("/employee/dashboard")}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-8"
        >
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">My Leave Requests</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Start Date</TableHead>
                    <TableHead className="text-gray-300">End Date</TableHead>
                    <TableHead className="text-gray-300">Reason</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <motion.tr key={request.id} variants={itemVariants}>
                      <TableCell className="text-gray-300">{request.startDate}</TableCell>
                      <TableCell className="text-gray-300">{request.endDate}</TableCell>
                      <TableCell className="text-gray-300">{request.reason}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          request.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                          request.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Submit New Leave Request</h2>
              <form onSubmit={handleLeaveRequestSubmit} className="space-y-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    id="startDate"
                    value={newLeaveRequest.startDate}
                    onChange={(e) =>
                      setNewLeaveRequest({
                        ...newLeaveRequest,
                        startDate: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    id="endDate"
                    value={newLeaveRequest.endDate}
                    onChange={(e) =>
                      setNewLeaveRequest({
                        ...newLeaveRequest,
                        endDate: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">
                    Reason
                  </label>
                  <Textarea
                    id="reason"
                    value={newLeaveRequest.reason}
                    onChange={(e) =>
                      setNewLeaveRequest({
                        ...newLeaveRequest,
                        reason: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-aqua-500 hover:bg-aqua-600 text-gray-900">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Leave Request
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      </main>

      <footer className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-400">
          © 2025 Employee Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LeaveRequestsPage;

