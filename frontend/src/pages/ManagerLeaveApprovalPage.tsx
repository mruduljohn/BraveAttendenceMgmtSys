import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LiveTime from "@/components/LiveTime";

interface LeaveRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  employeeId: number;
  comment: string;
}

const ManagerLeaveApprovalPage: React.FC = () => {
  const {accessToken } = useAuth();
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Fetch leave requests from the API
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/fetch_all_leave_requests/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leave requests");
        }

        const data = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedReport = data.data.map((emp: any) => ({
          id: emp.leave_id,
          employeeId: emp.employee,
          employeeName: emp.employee_name, // Adjust based on API response
          startDate: emp.start_date, // Adjust based on API response
          endDate: emp.end_date, // Adjust based on API response
          reason: emp.leave_type, // Adjust based on API response
          status: emp.status,
          comment: emp.comment // Adjust based on API response
        }));
        setLeaveRequests(formattedReport);

      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaveRequests();
  }, [accessToken]);

  const handleValidation = async (leaveId: number, employeeId: number, action: "approve" | "reject", commentData: string) => {
    const requestBody = {
      employee_id: employeeId,
      leave_id: leaveId,
      action: action,
      comment: commentData || "-------------",
    };
    console.log("body", requestBody);

    // Update leave request status in the frontend state
    const updatedRequests = leaveRequests.map((request) =>
      request.id === leaveId ? { ...request, status: action === "approve" ? "Approved" : "Rejected", comment: commentData } : request
    );
    setLeaveRequests(updatedRequests);
    setSelectedRequest(null);
    setComment("");

    // Make API call to update status
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accept_reject_leave_request/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to update leave request");
      }

    } catch (error) {
      console.error("Error updating leave request:", error);
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
    <div className="min-h-screen flex flex-col bg-slate-900">
      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <header className="relative z-10 bg-slate-800/50 backdrop-blur-lg border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Leave Request Validation</h1>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-300 hover:text-black"
                  onClick={() => navigate("/manager/dashboard")}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
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
          className="max-w-7xl mx-auto"
        >
          <Card className="bg-slate-800/50 backdrop-blur-lg border-blue-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-300">Employee</TableHead>
                  <TableHead className="text-slate-300">Start Date</TableHead>
                  <TableHead className="text-slate-300">End Date</TableHead>
                  <TableHead className="text-slate-300">Reason</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <motion.tr key={request.id} variants={itemVariants}>
                    <TableCell className="font-medium text-white">{request.employeeName}</TableCell>
                    <TableCell className="text-slate-300">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-green-400" />
                        {request.startDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-red-400" />
                        {request.endDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{request.reason}</TableCell>
                    <TableCell className="text-slate-300">
                      <span className={
                        request.status === "Approved" ? "text-green-500" :
                          request.status === "Rejected" ? "text-red-500" :
                            "text-yellow-500"
                      }>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {request.status === "Pending" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              onClick={() => { setSelectedRequest(request) }}
                            >
                              Validate
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white">
                            <DialogHeader>
                              <DialogTitle>Validate Leave Request</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Review and validate the leave request for {selectedRequest?.employeeName}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="start-date" className="text-right">
                                  Start Date
                                </Label>
                                <Input id="start-date" value={selectedRequest?.startDate} className="col-span-3" readOnly />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="end-date" className="text-right">
                                  End Date
                                </Label>
                                <Input id="end-date" value={selectedRequest?.endDate} className="col-span-3" readOnly />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reason" className="text-right">
                                  Reason
                                </Label>
                                <Input id="reason" value={selectedRequest?.reason} className="col-span-3" readOnly />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="comment" className="text-right">
                                  Comment
                                </Label>
                                <Textarea
                                  id="comment"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  className="col-span-3"
                                  placeholder="Add a comment (optional)"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                className="bg-green-600 text-white hover:bg-green-700"
                                onClick={() => handleValidation(selectedRequest!.id, selectedRequest!.employeeId, "approve", comment)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => handleValidation(selectedRequest!.id, selectedRequest!.employeeId, "reject", comment)}
                              >
                                Reject
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="text-slate-300">{request.comment}</div>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
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

export default ManagerLeaveApprovalPage;