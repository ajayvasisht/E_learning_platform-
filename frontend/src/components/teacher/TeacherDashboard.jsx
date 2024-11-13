import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreateCourse from './CreateCourse';
import CourseManagement from './CourseManagement';

const TeacherDashboard = () => {
  return (
    <div>
      <nav className="bg-white shadow-lg mb-6">
        <div className="container mx-auto px-6 py-3">
          <div className="flex space-x-4">
            <Link to="/teacher/create" className="text-gray-700 hover:text-blue-500">
              Create Course
            </Link>
            <Link to="/teacher/courses" className="text-gray-700 hover:text-blue-500">
              Manage Courses
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6">
        <Routes>
          <Route path="create" element={<CreateCourse />} />
          <Route path="courses" element={<CourseManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherDashboard;