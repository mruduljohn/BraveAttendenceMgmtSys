# AttendEase -Employee Attendance Management System

Welcome to the **AttendEase**! This project aims to streamline and enhance attendance tracking, leave management, and employee record handling for organizations. Developed with modern tools and best practices, it offers an intuitive interface and robust backend, ensuring scalability, security, and efficiency.

## 🛠️ Tech Stack

### Backend
- **Framework:** Django
- **Database:** PostgreSQL
- **Testing Tools:** Postman, Mock APIs

### Frontend
- **Framework:** React.js + TypeScript
- **Build Tool:** Vite
- **Styling:** Responsive and user-friendly UI

### Deployment
- **Containerization:** Docker (Frontend, Backend, Database)
- **Server:** AWS EC2
- **Orchestration:** Docker Compose

## 🚀 Features

### Admin
- Manage employees (Add, Update, Delete).
- Handle leave requests and approvals.
- Personal attendance management.

### Manager
- Personal attendance management.
- Team attendance tracking.
- Leave management for team members.
- Real-time updates on employee records.

### Employee
- Clock-in/Clock-out directly from the dashboard.
- View personal attendance records.
- Apply for leave.
- Edit profile and update details.

## 🖥️ Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the Project Directory**
   ```bash
   cd attendance-management-system
   ```

3. **Run Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

## 📊 Database Structure
- **Users Table:** Stores user details like `name`, `email`, `role`, etc.
- **Attendance Table:** Logs clock-in/clock-out data.
- **Leave Requests Table:** Tracks leave applications and approvals.

## 🔗 API Endpoints

### Authentication
- **POST** `/api/login/`: User login.

### Attendance
- **POST** `/api/attendance/clock_in_out/`: Clock-in/Clock-out.
- **GET** `/api/attendance/status/`: Get attendance status.

### Token Management
- **POST** `/api/token/validity-check/`: Check token validity.
- **POST** `/api/token/refresh/`: Refresh token.

### Employee Management (Admin Only)
- **POST** `/api/add_user/`: Add a new employee.
- **PUT** `/api/update_user_details/`: Update user details.
- **PUT** `/api/edit_user/`: Edit an existing user.
- **GET** `/api/user_list/`: List all users.
- **DELETE** `/api/delete_user/`: Remove a user.

### Attendance Records
- **GET** `/api/fetch_attendance/`: Fetch attendance records.
- **GET** `/api/fetch_all_attendance_records/`: Fetch all attendance records.

### Leave Management
- **POST** `/api/create_leave_requests/`: Submit a new leave request.
- **GET** `/api/fetch_leave_requests/`: Fetch leave requests for the logged-in user.
- **GET** `/api/fetch_all_leave_requests/`: Fetch all leave requests (Admin).
- **PUT** `/api/accept_reject_leave_request/`: Accept or reject a leave request.

### Reports
- **GET** `/api/generate_reports/<int:month>/`: Generate reports for a specific month.

## 🏗️ Upcoming Features
- **Notifications:** Email and in-app notifications for approvals.
- **Analytics Dashboard:** Advanced analytics for Admin and Manager roles.
- **Multi-Language Support:** English, Japanese, and more.

## 💻 Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

## 🛡️ License
This project is licensed under the [MIT License](LICENSE).

---

Feel free to reach out for any queries or support!
