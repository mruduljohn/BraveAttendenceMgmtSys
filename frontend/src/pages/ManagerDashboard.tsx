import LogoutButton from "../components/LogoutButton";  // Import the button

// Inside your dashboard component (e.g., ManagerDashboard.tsx)
const ManagerDashboard: React.FC = () => {
  return (
    <div>
      <h1>Manager Dashboard</h1>
      <LogoutButton />
    </div>
  );
};

export default ManagerDashboard;
