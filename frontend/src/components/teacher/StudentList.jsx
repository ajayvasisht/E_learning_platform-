import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentList = ({ courseId, courseName, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const fetchStudents = async () => {
    try {
      const response = await api.getStudentsByCourse(courseId);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = async (studentId, newGrade) => {
    try {
      await api.updateGrade(courseId, studentId, newGrade);
      fetchStudents(); // Refresh the list
      alert('Grade updated successfully!');
    } catch (error) {
      console.error('Error updating grade:', error);
      alert('Failed to update grade');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-48">
      <div className="text-lg text-gray-600">Loading students...</div>
    </div>;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Students in {courseName}</h3>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
      </div>

      {students.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No students enrolled in this course yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.StudentID}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.Email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.Grade || 'Not graded'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={student.Grade || ''}
                      onChange={(e) => handleGradeChange(student.StudentID, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                      <option value="">Select Grade</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="B-">B-</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;