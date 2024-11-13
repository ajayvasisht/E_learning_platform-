const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

const db = mysql.createConnection(dbConfig).promise();

// Register student
router.post('/register', async (req, res) => {
  const { name, email, username } = req.body;
  
  try {
    console.log('Registering student:', { name, email, username });

    const query = "INSERT INTO Student (Name, Email, Username) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [name, email, username]);
    
    console.log('Registration successful:', result);

    res.status(201).json({
      message: "Student registered successfully",
      id: result.insertId,
      name,
      email,
      username,
      role: 'student'
    });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ 
      message: "Error registering student",
      error: error.message 
    });
  }
});

// Get student's enrolled courses
router.get('/:studentId/courses', async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const query = `
      SELECT c.*, 
        CASE 
          WHEN coe.verified = TRUE THEN s.Grade
          ELSE 'Pending Verification'
        END as Grade
      FROM Course c
      JOIN Submission s ON c.CourseID = s.CourseID
      LEFT JOIN COE coe ON s.SubmissionID = coe.SubmissionID
      WHERE s.StudentID = ?
    `;
    const [courses] = await db.execute(query, [studentId]);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: "Error fetching enrolled courses" });
  }
});

// Get student's grades with verification status
router.get('/:studentId/grades', async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const query = `
      SELECT 
        c.Title, 
        s.Grade as AssignedGrade,
        CASE 
          WHEN coe.verified = TRUE THEN s.Grade
          ELSE 'Pending Verification'
        END as Grade,
        coe.verified as isVerified,
        coe.verification_date
      FROM Submission s
      JOIN Course c ON s.CourseID = c.CourseID
      LEFT JOIN COE coe ON s.SubmissionID = coe.SubmissionID
      WHERE s.StudentID = ? AND s.Grade IS NOT NULL
    `;
    
    const [grades] = await db.execute(query, [studentId]);
    res.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ message: "Error fetching grades" });
  }
});

// Enroll in a course
router.post('/enroll', async (req, res) => {
  const { studentId, courseId } = req.body;
  
  try {
    // Check if student is already enrolled
    const checkQuery = "SELECT * FROM Submission WHERE StudentID = ? AND CourseID = ?";
    const [existing] = await db.execute(checkQuery, [studentId, courseId]);
    
    if (existing.length > 0) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Create new enrollment
    const query = "INSERT INTO Submission (StudentID, CourseID) VALUES (?, ?)";
    const [result] = await db.execute(query, [studentId, courseId]);
    
    console.log('Enrollment successful:', result);

    res.status(201).json({ 
      message: "Successfully enrolled in course",
      submissionId: result.insertId 
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ 
      message: "Error enrolling in course",
      error: error.message 
    });
  }
});

// Calculate GPA using only verified grades
router.get('/:studentId/gpa', async (req, res) => {
  const { studentId } = req.params;
  
  try {
    console.log('Calculating GPA for student:', studentId);
    
    const query = `
      SELECT s.Grade, gs.GPA 
      FROM Submission s
      JOIN Grade_Scale gs ON s.Grade = gs.Grade
      JOIN COE coe ON s.SubmissionID = coe.SubmissionID
      WHERE s.StudentID = ? 
      AND s.Grade IS NOT NULL
      AND coe.verified = TRUE
    `;
    
    const [grades] = await db.execute(query, [studentId]);
    console.log('Found verified grades:', grades);

    if (grades.length === 0) {
      return res.json({ gpa: 'N/A' });
    }

    // Calculate average GPA from verified grades only
    const totalGPA = grades.reduce((sum, grade) => sum + parseFloat(grade.GPA), 0);
    const gpa = totalGPA / grades.length;
    
    console.log('Calculated GPA:', gpa);
    res.json({ gpa: gpa.toFixed(2) });
  } catch (error) {
    console.error('Error calculating GPA:', error);
    res.status(500).json({ 
      message: "Error calculating GPA",
      error: error.message 
    });
  }
});

module.exports = router;