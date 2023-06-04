// controllers/courses.js

const Course = require('../models/Courses');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a course
exports.addCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCourse = new Course({ title, description });
    await newCourse.save();
    res.json(newCourse);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const course = await Course.findByIdAndUpdate(id, { title, description }, { new: true });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const course = await Course.findByIdAndRemove(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.json({ message: 'Course deleted' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
};





