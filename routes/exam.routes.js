const express = require('express');
const router = express.Router();
const Exam = require('../controller/exam.controller');

router.post('/exams', Exam.createExam);

router.get('/exams', Exam.getAllExams);

router.get('/exams/:id', Exam.getExamById);

router.put('/exams/:id', Exam.updateExam);

router.delete('/exams/:id', Exam.deleteExam);

router.get('/courses/:course_id/exams', Exam.getExamsByCourse);

module.exports = router;
