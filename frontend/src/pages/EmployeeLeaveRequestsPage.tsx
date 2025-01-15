import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { access } from "fs";

interface LeaveRequest {
  leave_id: number;
  start_date: string;
  end_date: string;
  leave_type: string;
  status: string;
}

const EmployeeLeaveRequestsPage: React.FC = () => {
  const { user,accessToken } = useAuth();
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    start_date: "",
    end_date: "",
    leave_type: "",
    status: "Pending",
  });

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/fetch_leave_requests/", {
          headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch leave requests");
        }
        const data = await response.json();
        const mappedRequests = data.map((req: any) => ({
          leave_id: req.leave_id, // Generate a temporary unique ID for each request
          leave_type: req.leave_type,
          start_date: req.start_date,
          end_date: req.end_date,
          status: req.status,
          comment: req.comment,
        }));
        setLeaveRequests(mappedRequests);
        //console.log("Leave Requests:", mappedRequests);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, [accessToken]);

  const handleLeaveRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/create_leave_requests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newLeaveRequest),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit leave request");
      }

    // Re-fetch leave requests after successfully creating a new one
    const fetchResponse = await fetch("http://127.0.0.1:8000/api/fetch_leave_requests/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    
    if (!fetchResponse.ok) {
      throw new Error("Failed to fetch leave requests");
    }

    const data = await fetchResponse.json();
    console.log("data",data)
    const mappedRequests = data.map((req: any) => ({
      leave_id: req.leave_id,
      leave_type: req.leave_type,
      start_date: req.start_date,
      end_date: req.end_date,
      status: req.status,
    }));
    setLeaveRequests(mappedRequests);

    // Clear the form fields
    setNewLeaveRequest({ start_date: "", end_date: "", leave_type: "", status: "Pending" });

    alert("Leave request submitted successfully!");
  } catch (error) {
    console.error("Error submitting leave request:", error);
    alert("Failed to submit leave request. Please try again.");
  }
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
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <header className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Leave Requests</h1>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                    <TableHead className="text-gray-300">Leave ID</TableHead>
                    <TableHead className="text-gray-300">Start Date</TableHead>
                    <TableHead className="text-gray-300">End Date</TableHead>
                    <TableHead className="text-gray-300">Reason</TableHead>
                    <TableHead className="text-gray-300">Comments</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    
                    <motion.tr key={request.leave_id} variants={itemVariants}>
                      <TableCell className="text-gray-300">{request.leave_id}</TableCell>
                      <TableCell className="text-gray-300">{request.start_date}</TableCell>
                      <TableCell className="text-gray-300">{request.end_date}</TableCell>
                      <TableCell className="text-gray-300">{request.leave_type}</TableCell>
                      <TableCell className="text-gray-300">{request.comment}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            request.status === "Approved"
                              ? "bg-green-600 text-green-100"
                              : request.status === "Pending"
                              ? "bg-yellow-600 text-yellow-100"
                              : "bg-red-600 text-red-100"
                          }` }
                        >
                          {request.status}
                          
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Request Leave</h2>
              <form onSubmit={handleLeaveRequestSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={newLeaveRequest.start_date}
                    onChange={(e) =>
                      setNewLeaveRequest({ ...newLeaveRequest, start_date: e.target.value })
                    }
                    className="text-white"
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={newLeaveRequest.end_date}
                    onChange={(e) =>
                      setNewLeaveRequest({ ...newLeaveRequest, end_date: e.target.value })
                    }
                     className="text-white"
                  />
                </div>
                <Textarea
                  placeholder="Reason"
                  value={newLeaveRequest.leave_type}
                  onChange={(e) =>
                    setNewLeaveRequest({ ...newLeaveRequest, leave_type: e.target.value })
                    
                  }
                  className="mt-4 text-white"
                />
                <Button type="submit" className="mt-4">
                  Submit Leave Request
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default EmployeeLeaveRequestsPage;
