const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

const db = mysql.createConnection(dbConfig).promise();

// Register admin
router.post('/register', async (req, res) => {
  const { name, email, username } = req.body;
  
  try {
    console.log('Registering admin:', { name, email, username });

    const query = "INSERT INTO Admin (Name, Email, Username) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [name, email, username]);
    
    console.log('Admin registration successful:', result);

    res.status(201).json({
      message: "Admin registered successfully",
      id: result.insertId,
      name,
      email,
      username,
      role: 'admin'
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ 
      message: "Error registering admin",
      error: error.message 
    });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  const { email } = req.body;
  
  try {
    const query = "SELECT * FROM Admin WHERE Email = ?";
    const [admins] = await db.execute(query, [email]);

    if (admins.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = admins[0];
    res.json({
      id: admin.AdminID,
      name: admin.Name,
      email: admin.Email,
      username: admin.Username,
      role: 'admin'
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: "Error during login" });
  }
});

// Get all pending verifications for admin dashboard
router.get('/pending-verifications', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.Name as StudentName,
        c.Title as CourseTitle,
        sub.Grade,
        t.Name as TeacherName,
        sub.SubmissionID
      FROM Submission sub
      JOIN Student s ON sub.StudentID = s.StudentID
      JOIN Course c ON sub.CourseID = c.CourseID
      JOIN Teacher t ON c.TeacherID = t.TeacherID
      LEFT JOIN COE coe ON sub.SubmissionID = coe.SubmissionID
      WHERE sub.Grade IS NOT NULL 
      AND (coe.verified IS NULL OR coe.verified = FALSE)
    `;
    
    const [results] = await db.execute(query);
    res.json(results);
  } catch (error) {
    console.error('Error fetching verifications:', error);
    res.status(500).json({ message: "Error fetching verifications" });
  }
});

module.exports = router;