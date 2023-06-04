// routes/courses.js

const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');

router.get('/allcourses', getAllCourses);
router.post('/courses', addCourse);
router.put('/coursesupdate/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

module.exports = router;
