const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Other middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'E_Learning_Platform'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to database');
});

// Routes
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/teachers', require('./routes/teacher.routes'));
app.use('/api/courses', require('./routes/course.routes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to E-Learning Platform API." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const coeRoutes = require('./routes/coe.routes');
app.use('/api/coe', coeRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);