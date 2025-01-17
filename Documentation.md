# Design & Specification

## Project Name :  Employee Attendance Management System


## System Overview

The project is an **Attendance Management System** designed to track employee attendance, manage leave requests, and generate attendance reports. The system will allow users to clock in and clock out (using Face ID), track working hours, manage time off requests, and allow managers and admins to generate reports. The system will be role-based with different access levels for Admins, Managers, and Employees.

### Key Features:
- User Authentication & Authorization
- Clock In/Out (with Face ID verification)
- Leave Requests & Approval
- Attendance Reports Generation
- Role-Based Access (Admin, Manager, Employee)
- Notifications for Clock In/Out Reminders
- User Profile Management

---

## List of Features to Be Implemented

### User Authentication & Authorization
- **Login/Logout**: Users can log in with their credentials and log out of the system.
- **Registration**: New users can register by providing their email, username, and password.
- **Password Recovery**: Users can reset their password using their registered email.
- **Role-Based Access**: Different access levels for users (Admin, Manager, Employee).

### Attendance Management
- **Clock In/Out**: Employees can clock in or out using Face ID verification for attendance tracking.
- **View Personal Attendance Records**: Employees can view their daily, weekly, and monthly attendance.
- **Generate Attendance Reports**: Admins and Managers can generate reports of attendance, including hours worked and leave days.
- **Leave Requests**: Employees can submit requests for time off (vacation, sick leave, etc.), and Managers/Admins can approve or reject these requests.
- **Notifications**: Employees receive notifications for reminders to clock in/out and updates regarding leave approvals.

### Admin & Manager Functions
- **Manage Users**: Admins can add, edit, or delete user accounts, as well as assign roles (Admin, Manager, Employee).
- **Generate Attendance Reports**: Admins and Managers can generate comprehensive attendance reports for their team or the entire company.
- **Set Up Different Roles/Access Levels**: Admins can define and assign roles, granting different permissions within the system.

---

## Roles and Access Levels

### Manager Role
Managers have the following access rights:
- **Generate Attendance Reports**: Managers can generate attendance reports for their team members.
- **Leave Requests Approval**: Managers can approve or deny time-off requests submitted by employees.
- **Set Up Different Roles/Access Levels**: Managers can assign roles to users within their team, though they cannot manage system-wide roles.

### Admin Role
Admins have full control over the system and can perform the following actions:
- **Manage User Accounts**: Admins can add, edit, or delete user accounts and modify user roles.
- **Generate Attendance Reports**: Admins can generate attendance reports for all employees in the system.
- **Set Up Different Roles/Access Levels**: Admins can define and modify user roles, granting them complete control over the system's access management.

### Employee Role
Employees have the following permissions:
- **Clock In/Out**: Employees can clock in or out using Face ID for attendance verification.
- **View Personal Attendance Records**: Employees can view their own attendance, including clock-in/out times and total hours worked.
- **Request Time Off**: Employees can submit requests for vacation, sick leave, etc.
- **Receive Notifications**: Employees will receive notifications for reminders to clock in/out and updates on their leave requests.

---

## Data Structures & Database Design
![ER Diagram](images/Database%20Tables%20-%20ER%20Diagram1.jpg)
## Flowchart

Here’s a simple flowchart representing the **Clock In/Out Process**:
1. Login Functionality:  
![Attendance Flowchart](images/Flowchart_Brave%20-%20Login1.jpg)
2. Administrator  Functionality Flow:
![Attendance Flowchart](images/Flowchart_Brave%20-%20ADMINISTRATOR1.jpg)
3. Manager Functionality Flow:
![Attendance Flowchart](images/Flowchart_Brave%20-%20Manager1.jpg)
4. Employee  Functionality Flow:
![Attendance Flowchart](images/Flowchart_Brave%20-%20Employee1.jpg)


