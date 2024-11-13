const db = require('../config/db.config');

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.email || !req.body.username) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
    return;
  }

  // Create a Student
  const student = {
    Name: req.body.name,
    Email: req.body.email,
    Username: req.body.username
  };

  // Save Student in the database
  db.query("INSERT INTO Student SET ?", student, (err, result) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Student."
      });
    } else {
      res.send({
        message: "Student was registered successfully!",
        id: result.insertId
      });
    }
  });
};