import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Registration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'student',
    domain: '',
    experience: 0
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Submitting registration:', formData);
      
      let response;
      switch(formData.role) {
        case 'student':
          response = await api.registerStudent(formData);
          break;
        case 'teacher':
          response = await api.registerTeacher(formData);
          break;
        case 'admin':
          response = await api.registerAdmin({
            name: formData.name,
            email: formData.email,
            username: formData.username
          });
          break;
        default:
          throw new Error('Invalid role selected');
      }
      
      console.log('Registration response:', response);

      if (response.data) {
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: formData.role
        };

        // Add domain and experience only for teachers
        if (formData.role === 'teacher') {
          userData.domain = response.data.domain;
          userData.experience = response.data.experience;
        }

        console.log('Logging in user with data:', userData);
        login(userData);
        
        // Navigate based on role
        switch(formData.role) {
          case 'student':
            navigate('/student');
            break;
          case 'teacher':
            navigate('/teacher');
            break;
          case 'admin':
            navigate('/coe/management');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin (COE)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        {/* Show domain and experience fields only for teachers */}
        {formData.role === 'teacher' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Domain</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="e.g., Computer Science"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={formData.experience}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  experience: parseInt(e.target.value) || 0 
                })}
                min="0"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Registration;