const express = require('express');
const router = express.Router();
const Course = require('../controller/course.controller');

router.post('/courses', Course.createCourse);

router.get('/courses', Course.getAllCourses);

router.get('/courses/:id', Course.getCourseById);

router.put('/courses/:id', Course.updateCourse);

router.delete('/courses/:id', Course.deleteCourse);

module.exports = router;
