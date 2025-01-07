import React, { useState, useEffect } from "react";

const LeaveRequestsPage: React.FC = () => {
  // Sample state for storing the leave requests (you would fetch this from the backend)
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
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

  const handleLeaveRequestSubmit = () => {
    // Handle the submission of the new leave request
    // You should make an API call to submit the leave request to the backend
    console.log("Leave request submitted", newLeaveRequest);

    // After submission, you could clear the form or show a success message
    setNewLeaveRequest({ startDate: "", endDate: "", reason: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>

      {/* Display list of leave requests */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">My Leave Requests</h2>
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Start Date</th>
              <th className="px-4 py-2 border">End Date</th>
              <th className="px-4 py-2 border">Reason</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-4 py-2 border">{request.startDate}</td>
                <td className="px-4 py-2 border">{request.endDate}</td>
                <td className="px-4 py-2 border">{request.reason}</td>
                <td className="px-4 py-2 border">{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form to submit a new leave request */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Submit New Leave Request</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLeaveRequestSubmit();
          }}
        >
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={newLeaveRequest.startDate}
              onChange={(e) =>
                setNewLeaveRequest({
                  ...newLeaveRequest,
                  startDate: e.target.value,
                })
              }
              className="mt-1 px-3 py-2 w-full border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={newLeaveRequest.endDate}
              onChange={(e) =>
                setNewLeaveRequest({
                  ...newLeaveRequest,
                  endDate: e.target.value,
                })
              }
              className="mt-1 px-3 py-2 w-full border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium">
              Reason
            </label>
            <textarea
              id="reason"
              value={newLeaveRequest.reason}
              onChange={(e) =>
                setNewLeaveRequest({
                  ...newLeaveRequest,
                  reason: e.target.value,
                })
              }
              className="mt-1 px-3 py-2 w-full border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestsPage;
