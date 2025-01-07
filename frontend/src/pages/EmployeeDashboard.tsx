import LogoutButton from "../components/LogoutButton";  // Import the button

// Inside your dashboard component (e.g., EmployeeDashboard.tsx)
const EmployeeDashboard: React.FC = () => {
  return (
    <div>
      <h1>Employee Dashboard</h1>
      <LogoutButton />
    </div>
  );
};

export default EmployeeDashboard;
