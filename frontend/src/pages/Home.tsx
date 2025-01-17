import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Calendar, BarChart, ArrowRight, Github, Linkedin, Briefcase, Shield } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredDev, setHoveredDev] = useState<string | null>(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const developers = [
    { name: 'Mrudul', github: 'https://github.com/mruduljohn', linkedin: 'https://linkedin.com/in/mruduljohnmathews' },
    { name: 'Joel', github: 'https://github.com/joelgeorge-web', linkedin: 'https://www.linkedin.com/in/joelgeorge98765/' },
    { name: 'Aarsha', github: 'https://github.com/aarsha01', linkedin: 'https://www.linkedin.com/in/aarsha-leena-a79778201/' },
  ];

  const features = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Real-time Tracking",
      description: "Clock in/out with ease and monitor attendance in real-time"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Leave Management",
      description: "Streamlined leave requests and approval workflow"
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive reports and attendance insights"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Management",
      description: "Efficiently manage your team's attendance and leaves"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Role Based Managemennt",
      description: "Well defined access for employees, managers and admins"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Data Security",
      description: "Robust encryption and secure data handling protocols"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-gray-800/80 backdrop-blur-sm fixed w-full z-10 border-b border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="h-8 w-8 text-aqua-400" />
              <span className="text-xl font-bold text-white">AttendEase</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoginClick}
              className="bg-aqua-500 hover:bg-aqua-600 text-gray-900 px-6 py-2 rounded-full 
                       transition-all duration-300 flex items-center space-x-2"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-white">
              Employee Attendance
              <motion.span 
                className="block text-aqua-400 mt-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Made Simple
              </motion.span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-300">
              Streamline your workforce management with our comprehensive attendance tracking system.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow 
                         duration-300 border border-gray-700 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-12 w-12 bg-gray-700 rounded-lg flex items-center justify-center text-aqua-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Built with Modern Technology
          </motion.h2>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          >
            {['React', 'Django', 'PostgreSQL', 'Docker'].map((tech, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 px-6 py-4 rounded-lg shadow-md border border-gray-600 
                           w-full text-center font-medium text-aqua-400"
                whileHover={{ scale: 1.05, rotate: 5 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {tech}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Developers Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Meet the Developers
          </motion.h2>
          <div className="flex justify-center space-x-8">
            {developers.map((dev, index) => (
              <motion.div 
                key={index}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setHoveredDev(dev.name)}
                onHoverEnd={() => setHoveredDev(null)}
              >
                <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-2xl text-aqua-400">{dev.name[0]}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{dev.name}</h3>
                <AnimatePresence>
                  {hoveredDev === dev.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-center space-x-4"
                    >
                      <a href={dev.github} target="_blank" rel="noopener noreferrer">
                        <Github className="text-gray-400 hover:text-aqua-400" />
                      </a>
                      <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="text-gray-400 hover:text-aqua-400" />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* GitHub Project Link */}
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.a
            href="https://github.com/mruduljohn/BraveAttendenceMgmtSys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-aqua-400 hover:text-aqua-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-6 h-6" />
            <span>View Project on GitHub</span>
          </motion.a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} AttendEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

