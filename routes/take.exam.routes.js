const express = require('express');
const router = express.Router();
const TakeExam = require('../controller/take.exam.controller');
const authenticateUser = require('../middleware/authentication');

// Take exam route (requires authentication)
router.post('/exams/take-exam', authenticateUser, TakeExam.take_exam_controller);

module.exports = router;