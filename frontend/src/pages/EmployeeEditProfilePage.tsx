import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Briefcase, Building, Calendar } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LiveTime from "@/components/LiveTime";
import axiosInstance from "@/utils/authService";

const EditProfilePage: React.FC = () => {
  const { user, updateUser, accessToken } = useAuth();
  const navigate = useNavigate();


  // Initialize state with user data
  const [profileData, setProfileData] = useState({
    employee_id: user?.employee_id || 0,
    role: user?.role || "",
    username: user?.username || "",
    email: user?.email || "",
    position: user?.position || "",
    department: user?.department || "",
    joined_date: user?.joined_date || "",
    profilePicture: "https://mighty.tools/mockmind-api/content/cartoon/10.jpg",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axiosInstance.patch("/update_user_details/",profileData);

      const result = await response.data;
      console.log("Full API response:", result);

      const updatedData = result.data;
      console.log("Extracted updated data:", updatedData);

      console.log("User state before update:", user);
      // Update both local and global state
      setProfileData(updatedData);
      updateUser(profileData);
      // Navigate after successful update
      navigate("/employee/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an issue updating your profile. Please try again.");
    }
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfileData(prev => ({
  //         ...prev,
  //         profilePicture: reader.result as string
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

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
      {/* Rest of the JSX remains the same */}
      <header className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Edit Your Profile</h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-300 hover:text-black"
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
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <motion.div variants={itemVariants} className="flex items-center justify-center">
                <div className="relative">
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-2 border-aqua-400"
                  />
                  {/* <Label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-aqua-500 text-gray-900 rounded-full p-2 cursor-pointer">
                    <Camera className="w-5 h-5" />
                  </Label>
                  <Input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  /> */}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="username" className="text-white">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="position" className="text-white">Position</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="position"
                    name="position"
                    value={profileData.position}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="department" className="text-white">Department</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="department"
                    name="department"
                    value={profileData.department}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="joined_date" className="text-white">Joined Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="joined_date"
                    name="joined_date"
                    value={profileData.joined_date}
                    readOnly
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-aqua-500 hover:bg-aqua-600 text-gray-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Save Changes
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </main>

      <footer className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-400">
          <LiveTime />
        </div>
      </footer>
    </div>
  );
};

export default EditProfilePage;