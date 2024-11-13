import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">E-Learning Platform</span>
            </Link>
          </div>

          {/* Right side - Navigation & User Info */}
          <div className="flex items-center">
            {user ? (
              // Only show this section if user is logged in
              <div className="flex items-center space-x-4">
                <div className="text-gray-700">
                  Welcome, {user.name} ({user.role})
                  {user.role === 'teacher' && user.domain && (
                    <span className="ml-2 text-sm text-gray-500">
                      Domain: {user.domain}
                    </span>
                  )}
                </div>

                {user.role === 'student' ? (
                  <div className="flex space-x-4">
                    <Link to="/student/courses" className="text-gray-700 hover:text-blue-500">
                      Available Courses
                    </Link>
                    <Link to="/student/enrolled" className="text-gray-700 hover:text-blue-500">
                      My Courses
                    </Link>
                    <Link to="/student/grades" className="text-gray-700 hover:text-blue-500">
                      My Grades
                    </Link>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <Link to="/teacher/create" className="text-gray-700 hover:text-blue-500">
                      Create Course
                    </Link>
                    <Link to="/teacher/courses" className="text-gray-700 hover:text-blue-500">
                      Manage Courses
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Show this section if no user is logged in
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-500 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;