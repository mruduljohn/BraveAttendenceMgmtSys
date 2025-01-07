import LogoutButton from "../components/LogoutButton";  // Import the button

// Inside your dashboard component (e.g., AdminDashboard.tsx)
const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <LogoutButton />
    </div>
  );
};

export default AdminDashboard;
