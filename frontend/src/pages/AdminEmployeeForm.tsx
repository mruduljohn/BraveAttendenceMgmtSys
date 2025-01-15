import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { User, Mail, Briefcase, Save, ArrowLeft, Building, Calendar } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LiveTime from "@/components/LiveTime";
import { useAuth } from "../context/AuthContext";

interface Employee {
  employee_id: number;
  username: string;
  email: string;
  role: string;
  position: string;
  department: string;
  password?: string;
  joined_date: string;
}

const INITIAL_EMPLOYEE: Employee = {
  employee_id: 0,
  username: '',
  email: '',
  role: 'employee',
  position: 'SE',
  department: 'IT',
  password: '',
  joined_date: new Date().toISOString().split('T')[0]
};

const AdminEmployeeForm: React.FC = () => {
  const { user, accessToken } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [employee, setEmployee] = useState<Employee>(INITIAL_EMPLOYEE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!isEditMode) return;

      setIsLoading(true);
      setError(null);

      try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${baseUrl}/api/user_list/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const employeeData = result.data.find((emp: Employee) => emp.employee_id === Number(id));

        if (!employeeData) {
          throw new Error('Employee not found');
        }

        // Remove password from edit form
        const { password, ...employeeWithoutPassword } = employeeData;
        setEmployee(employeeWithoutPassword);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch employee data');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [isEditMode, id, accessToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const baseUrl = process.env.REACT_APP_API_URL;

    const apiUrl = isEditMode 
      ? `${baseUrl}/api/edit_user/`
      : `${baseUrl}/api/add_user/`;

    const method = isEditMode ? 'PATCH' : 'POST';
    
    // For edit mode, ensure employee_id is included in the payload
    const submitData = isEditMode
      ? {
          ...employee,
          employee_id: Number(id),
          password: employee.password || undefined // Remove empty password
        }
      : employee;

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save employee data');
      }

      navigate('/admin/employees');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while saving employee data');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const positions = [
    { value: 'SE', label: 'Server Engineer' },
    { value: 'AD', label: 'Android Developer' },
    { value: 'ID', label: 'iOS Developer' },
    { value: 'HR', label: 'Human Resources' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
      
      <header className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Edit' : 'Create'} Employee</h1>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-300 hover:text-white"
              onClick={() => navigate('/admin/employees')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Employees</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700">
            {error && (
              <div className="p-4 mb-4 text-red-400 bg-red-900/50 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <Label htmlFor="username" className="text-white">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    required
                    id="username"
                    name="username"
                    value={employee.username}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    required
                    id="email"
                    name="email"
                    type="email"
                    value={employee.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              {!isEditMode && (
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      required={!isEditMode}
                      id="password"
                      name="password"
                      type="password"
                      value={employee.password || ''}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="position" className="text-white">Position</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <Select 
                    name="position" 
                    value={employee.position} 
                    onValueChange={(value) => handleSelectChange('position', value)}
                  >
                    <SelectTrigger className="pl-10 bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="department" className="text-white">Department</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    required
                    id="department"
                    name="department"
                    value={employee.department}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role" className="text-white">Role</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <Select 
                    name="role" 
                    value={employee.role} 
                    onValueChange={(value) => handleSelectChange('role', value)}
                  >
                    <SelectTrigger className="pl-10 bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Employee">Employee</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="joined_date" className="text-white">Joined Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    required
                    id="joined_date"
                    name="joined_date"
                    type="date"
                    value={employee.joined_date}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'} Employee
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <footer className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-400">
          <LiveTime />
        </div>
      </footer>
    </div>
  );
}

export default AdminEmployeeForm;