import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const COEManagement = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      const response = await api.getPendingVerifications();
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      setError('Failed to load pending verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (submissionId) => {
    try {
      await api.verifyGrade(submissionId);
      setSuccessMessage('Grade verified successfully');
      // Remove the verified submission from the list
      setSubmissions(submissions.filter(sub => sub.SubmissionID !== submissionId));
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error verifying grade:', error);
      setError('Failed to verify grade');
      setTimeout(() => setError(''), 3000); // Clear error message after 3 seconds
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg text-gray-600">Loading pending verifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">COE Grade Verification</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-600">No pending verifications</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub.SubmissionID}>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.StudentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.CourseTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.Grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.TeacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleVerify(sub.SubmissionID)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Verify
                    </button>
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

export default COEManagement;