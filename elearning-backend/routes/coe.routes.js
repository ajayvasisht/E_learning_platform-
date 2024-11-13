const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

const db = mysql.createConnection(dbConfig).promise();

// Get all pending verifications
router.get('/pending-verifications', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.Name as StudentName,
        c.Title as CourseTitle,
        sub.Grade,
        t.Name as TeacherName,
        sub.SubmissionID,
        coe.verified
      FROM Submission sub
      JOIN Student s ON sub.StudentID = s.StudentID
      JOIN Course c ON sub.CourseID = c.CourseID
      JOIN Teacher t ON c.TeacherID = t.TeacherID
      LEFT JOIN COE coe ON sub.SubmissionID = coe.SubmissionID
      WHERE sub.Grade IS NOT NULL 
      AND (coe.verified IS NULL OR coe.verified = FALSE)
    `;
    
    const [results] = await db.execute(query);
    console.log('Pending verifications:', results);
    res.json(results);
  } catch (error) {
    console.error('Error fetching verifications:', error);
    res.status(500).json({ message: "Error fetching verifications" });
  }
});

// Verify a grade
router.put('/verify/:submissionId', async (req, res) => {
  const { submissionId } = req.params;
  
  try {
    // Begin transaction
    await db.beginTransaction();

    // Check if COE record exists
    const [existing] = await db.execute(
      'SELECT * FROM COE WHERE SubmissionID = ?',
      [submissionId]
    );

    if (existing.length > 0) {
      // Update existing record
      await db.execute(
        'UPDATE COE SET verified = TRUE, verification_date = CURRENT_TIMESTAMP WHERE SubmissionID = ?',
        [submissionId]
      );
    } else {
      // Get submission details
      const [submission] = await db.execute(
        'SELECT StudentID, CourseID, Grade FROM Submission WHERE SubmissionID = ?',
        [submissionId]
      );

      // Get TeacherID from Course
      const [course] = await db.execute(
        'SELECT TeacherID FROM Course WHERE CourseID = ?',
        [submission[0].CourseID]
      );

      // Insert new COE record
      await db.execute(
        `INSERT INTO COE (SubmissionID, StudentID, CourseID, TeacherID, Grade, verified, verification_date)
         VALUES (?, ?, ?, ?, ?, TRUE, CURRENT_TIMESTAMP)`,
        [submissionId, submission[0].StudentID, submission[0].CourseID, course[0].TeacherID, submission[0].Grade]
      );
    }

    await db.commit();
    res.json({ message: "Grade verified successfully" });
  } catch (error) {
    await db.rollback();
    console.error('Error verifying grade:', error);
    res.status(500).json({ message: "Error verifying grade" });
  }
});

module.exports = router;