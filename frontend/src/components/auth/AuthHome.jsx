import React from 'react';
import { Link } from 'react-router-dom';

const AuthHome = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h1 className="text-3xl font-bold text-center mb-8">E-Learning Platform</h1>
      <div className="space-y-4">
        <Link
          to="/login"
          className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="block w-full bg-green-500 text-white text-center py-2 px-4 rounded-md hover:bg-green-600"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default AuthHome;