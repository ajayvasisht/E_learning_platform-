import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CourseList from './CourseList';
import EnrolledCourses from './EnrolledCourses';
import StudentGrades from './StudentGrades';

const StudentDashboard = () => {
  return (
    <div>
      <nav className="bg-white shadow-lg mb-6">
        <div className="container mx-auto px-6 py-3">
          <div className="flex space-x-4">
            <Link to="/student/courses" className="text-gray-700 hover:text-blue-500">Available Courses</Link>
            <Link to="/student/enrolled" className="text-gray-700 hover:text-blue-500">My Courses</Link>
            <Link to="/student/grades" className="text-gray-700 hover:text-blue-500">My Grades</Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6">
        <Routes>
          <Route path="courses" element={<CourseList />} />
          <Route path="enrolled" element={<EnrolledCourses />} />
          <Route path="grades" element={<StudentGrades />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;