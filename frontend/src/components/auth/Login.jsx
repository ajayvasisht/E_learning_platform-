import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    role: 'student'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting login:', formData);
      
      let response;
      switch(formData.role) {
        case 'student':
          response = await api.loginStudent(formData);
          break;
        case 'teacher':
          response = await api.loginTeacher(formData);
          break;
        case 'admin':
          response = await api.loginAdmin(formData);
          break;
        default:
          throw new Error('Invalid role selected');
      }
      
      console.log('Login response:', response);

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
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/register" className="text-blue-500 hover:text-blue-600">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;