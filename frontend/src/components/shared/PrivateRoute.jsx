import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

export default PrivateRoute;