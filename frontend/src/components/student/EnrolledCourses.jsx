import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.getEnrolledCourses(user.id);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading enrolled courses...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.CourseID} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{course.Title}</h3>
            <p className="text-gray-600">Domain: {course.Domain}</p>
            <p className="text-gray-600">Year: {course.Year}</p>
            <p className="text-gray-600">Grade: {course.Grade || 'Not graded yet'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;