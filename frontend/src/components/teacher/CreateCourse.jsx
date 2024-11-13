import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const CreateCourse = () => {
  const { user } = useAuth();
  const [courseData, setCourseData] = useState({
    title: '',
    year: new Date().getFullYear(),
    domain: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createCourse({
        ...courseData,
        teacherId: user.id
      });
      alert('Course created successfully!');
      setCourseData({
        title: '',
        year: new Date().getFullYear(),
        domain: '',
      });
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={courseData.title}
            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={courseData.year}
            onChange={(e) => setCourseData({ ...courseData, year: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Domain</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={courseData.domain}
            onChange={(e) => setCourseData({ ...courseData, domain: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;