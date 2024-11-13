const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

const db = mysql.createConnection(dbConfig).promise();

// Student login
router.post('/students/login', async (req, res) => {
  const { email } = req.body;
  
  try {
    const [students] = await db.execute(
      "SELECT * FROM Student WHERE Email = ?",
      [email]
    );

    if (students.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const student = students[0];
    res.json({
      id: student.StudentID,
      name: student.Name,
      email: student.Email,
      role: 'student'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Error during login" });
  }
});

// Teacher login
router.post('/teachers/login', async (req, res) => {
  const { email } = req.body;
  
  try {
    const [teachers] = await db.execute(
      "SELECT * FROM Teacher WHERE Email = ?",
      [email]
    );

    if (teachers.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const teacher = teachers[0];
    res.json({
      id: teacher.TeacherID,
      name: teacher.Name,
      email: teacher.Email,
      domain: teacher.Domain,
      experience: teacher.Experience,
      role: 'teacher'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Error during login" });
  }
});

module.exports = router;