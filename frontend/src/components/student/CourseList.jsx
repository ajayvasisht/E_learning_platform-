import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.enrollInCourse({
        studentId: user.id,
        courseId: courseId
      });
      alert('Successfully enrolled in course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.CourseID} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">{course.Title}</h3>
          <p className="text-gray-600">Domain: {course.Domain}</p>
          <p className="text-gray-600">Year: {course.Year}</p>
          <button
            onClick={() => handleEnroll(course.CourseID)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Enroll
          </button>
        </div>
      ))}
    </div>
  );
};

export default CourseList;