const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

const db = mysql.createConnection(dbConfig).promise();

// Existing registration route
router.post('/register', async (req, res) => {
  const { name, email, username } = req.body;
  const domain = req.body.domain || 'General';
  const experience = req.body.experience || 0;
  
  try {
    console.log('Registering teacher:', { name, email, domain, experience });

    const query = "INSERT INTO Teacher (Name, Email, Domain, Experience) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [name, email, domain, experience]);
    
    console.log('Registration successful:', result);

    res.status(201).json({
      message: "Teacher registered successfully",
      id: result.insertId,
      name,
      email,
      domain,
      experience,
      role: 'teacher'
    });
  } catch (error) {
    console.error('Error registering teacher:', error);
    res.status(500).json({ 
      message: "Error registering teacher",
      error: error.message 
    });
  }
});

// Existing get courses route
router.get('/:teacherId/courses', async (req, res) => {
  const { teacherId } = req.params;
  
  try {
    const query = "SELECT * FROM Course WHERE TeacherID = ?";
    const [courses] = await db.execute(query, [teacherId]);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Add this new route for grade assignment
router.put('/:courseId/students/:studentId/grade', async (req, res) => {
  const { courseId, studentId } = req.params;
  const { grade } = req.body;
  
  try {
    console.log('Updating grade:', { courseId, studentId, grade });

    await db.beginTransaction();

    // Update Submission table
    const submissionQuery = `
      UPDATE Submission 
      SET Grade = ? 
      WHERE CourseID = ? AND StudentID = ?
    `;
    await db.execute(submissionQuery, [grade, courseId, studentId]);
    
    // Update COE table and set as unverified
    const coeQuery = `
      UPDATE COE 
      SET Grade = ?, 
          verified = FALSE, 
          verification_date = NULL 
      WHERE CourseID = ? AND StudentID = ?
    `;
    await db.execute(coeQuery, [grade, courseId, studentId]);
    
    await db.commit();
    console.log('Grade updated successfully');
    
    res.json({ message: "Grade updated successfully" });
  } catch (error) {
    await db.rollback();
    console.error('Error updating grade:', error);
    res.status(500).json({ 
      message: "Error updating grade",
      error: error.message 
    });
  }
});

module.exports = router;