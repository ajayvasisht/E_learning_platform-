import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import StudentList from './StudentList';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      console.log('Fetching courses for teacher:', user.id);
      const response = await api.getCoursesByTeacher(user.id);
      console.log('Fetched courses:', response.data);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
      
      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">You haven't created any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.CourseID} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{course.Title}</h3>
              <p className="text-gray-600">Domain: {course.Domain}</p>
              <p className="text-gray-600">Year: {course.Year}</p>
              <button
                onClick={() => setSelectedCourse(course)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                View Students
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <StudentList
          courseId={selectedCourse.CourseID}
          courseName={selectedCourse.Title}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};

export default CourseManagement;