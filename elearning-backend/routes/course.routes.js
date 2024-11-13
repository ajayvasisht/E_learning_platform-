const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

// Create a promise-based connection
const db = mysql.createConnection(dbConfig).promise();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const [courses] = await db.execute("SELECT * FROM Course");
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Create new course
router.post('/', async (req, res) => {
  const { title, year, domain, teacherId } = req.body;
  
  try {
    console.log('Creating course:', { title, year, domain, teacherId });

    const [result] = await db.execute(
      "INSERT INTO Course (Title, Year, Domain, TeacherID) VALUES (?, ?, ?, ?)",
      [title, year, domain, teacherId]
    );
    
    console.log('Course creation successful:', result);

    res.status(201).json({
      message: "Course created successfully",
      id: result.insertId,
      title,
      year,
      domain,
      teacherId
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ 
      message: "Error creating course",
      error: error.message 
    });
  }
});

// Get students in a course
router.get('/:courseId/students', async (req, res) => {
  const { courseId } = req.params;
  
  try {
    const [students] = await db.execute(`
      SELECT s.StudentID, s.Name, s.Email, sub.Grade
      FROM Student s
      JOIN Submission sub ON s.StudentID = sub.StudentID
      WHERE sub.CourseID = ?
    `, [courseId]);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: "Error fetching students" });
  }
});

// Update student grade
router.put('/:courseId/students/:studentId/grade', async (req, res) => {
  const { courseId, studentId } = req.params;
  const { grade } = req.body;
  
  try {
    // Begin transaction
    await db.beginTransaction();

    // Update Submission table
    await db.execute(
      "UPDATE Submission SET Grade = ? WHERE CourseID = ? AND StudentID = ?",
      [grade, courseId, studentId]
    );
    
    // Update COE table
    await db.execute(
      "UPDATE COE SET Grade = ? WHERE CourseID = ? AND StudentID = ?",
      [grade, courseId, studentId]
    );

    // Commit transaction
    await db.commit();
    
    res.json({ message: "Grade updated successfully" });
  } catch (error) {
    // Rollback in case of error
    await db.rollback();
    console.error('Error updating grade:', error);
    res.status(500).json({ message: "Error updating grade" });
  }
});
router.get('/teacher/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
    
    try {
      console.log('Fetching courses for teacher:', teacherId);
      const [courses] = await db.execute(
        "SELECT * FROM Course WHERE TeacherID = ?",
        [teacherId]
      );
      console.log('Found courses:', courses);
      res.json(courses);
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      res.status(500).json({ message: "Error fetching teacher courses" });
    }
  });

module.exports = router;