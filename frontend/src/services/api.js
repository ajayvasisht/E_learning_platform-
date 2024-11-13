import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = {
  // Auth endpoints
  registerStudent: (data) => axios.post(`${API_URL}/students/register`, data),
  registerTeacher: (data) => axios.post(`${API_URL}/teachers/register`, data),
  registerAdmin: (data) => axios.post(`${API_URL}/admin/register`, data), // Now using dedicated admin endpoint
  loginStudent: (data) => axios.post(`${API_URL}/students/login`, data),
  loginTeacher: (data) => axios.post(`${API_URL}/teachers/login`, data),
  loginAdmin: (data) => axios.post(`${API_URL}/admin/login`, data), // Now using dedicated admin endpoint
  
  // Student course endpoints
  getAllCourses: () => axios.get(`${API_URL}/courses`),
  enrollInCourse: (data) => axios.post(`${API_URL}/students/enroll`, data),
  getEnrolledCourses: (studentId) => axios.get(`${API_URL}/students/${studentId}/courses`),
  
  // Student grade endpoints
  getStudentGrades: (studentId) => axios.get(`${API_URL}/students/${studentId}/grades`),
  calculateGPA: (studentId) => axios.get(`${API_URL}/students/${studentId}/gpa`),
  
  // Teacher course endpoints
  createCourse: (data) => axios.post(`${API_URL}/courses`, data),
  getCoursesByTeacher: (teacherId) => axios.get(`${API_URL}/courses/teacher/${teacherId}`),
  getStudentsByCourse: (courseId) => axios.get(`${API_URL}/courses/${courseId}/students`),
  updateGrade: (courseId, studentId, grade) => 
    axios.put(`${API_URL}/courses/${courseId}/students/${studentId}/grade`, { grade }),

  // COE (Admin) endpoints
  getPendingVerifications: () => axios.get(`${API_URL}/admin/pending-verifications`), // Updated to use admin route
  verifyGrade: (submissionId) => axios.put(`${API_URL}/coe/verify/${submissionId}`),
  getGradeHistory: (courseId) => axios.get(`${API_URL}/admin/grades/${courseId}/history`),
  getVerifiedGrades: () => axios.get(`${API_URL}/admin/grades/verified`),
  getUnverifiedGrades: () => axios.get(`${API_URL}/admin/grades/unverified`),
  
  // Admin management endpoints
  getAllAdmins: () => axios.get(`${API_URL}/admin`),
  updateAdmin: (adminId, data) => axios.put(`${API_URL}/admin/${adminId}`, data),
  deleteAdmin: (adminId) => axios.delete(`${API_URL}/admin/${adminId}`),
  
  // Error handling interceptor
  handleError: (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    }
    throw error;
  }
};

// Add response interceptor for global error handling
axios.interceptors.response.use(
  response => response,
  error => Promise.reject(api.handleError(error))
);

export default api;