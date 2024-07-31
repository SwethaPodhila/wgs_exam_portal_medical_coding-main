const express = require('express');
const router = express.Router();
const AddedExam = require('../controller/added_exam.controller');
const authenticateUser = require('../middleware/authentication');

// Take exam screen route (requires authentication)
router.get('/exam-questions', authenticateUser, AddedExam.see_exam_screen);

router.get('/questions', authenticateUser, AddedExam.getAllQuestions);

router.get('/exam-questions-grouped', authenticateUser, AddedExam.getAllQuestionsGroupedByExam);



module.exports = router;