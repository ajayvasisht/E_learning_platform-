import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/shared/Navbar';
import AuthHome from './components/auth/AuthHome';
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import COEManagement from './components/coe/COEManagement';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<AuthHome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/student/*" element={<StudentDashboard />} />
              <Route path="/teacher/*" element={<TeacherDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/coe/management" element={<COEManagement />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;