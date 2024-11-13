import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchGradesAndGpa();
  }, []);

  const fetchGradesAndGpa = async () => {
    try {
      setLoading(true);
      const [gradesResponse, gpaResponse] = await Promise.all([
        api.getStudentGrades(user.id),
        api.calculateGPA(user.id)
      ]);

      setGrades(gradesResponse.data);
      setGpa(gpaResponse.data.gpa);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading grades...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your GPA</h2>
        <p className="text-4xl font-bold text-blue-600">
          {gpa === 'N/A' ? 'No verified grades yet' : gpa}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Course Grades</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{grade.Title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {grade.Grade === 'Pending Verification' ? '-' : grade.Grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {grade.Grade === 'Pending Verification' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending Verification
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;