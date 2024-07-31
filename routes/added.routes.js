const express = require('express');
const router = express.Router();
const Added = require('../controller/added.controller');
const authenticateUser = require('../middleware/authentication');

// Take exam screen route (requires authentication)
router.get('/seeing', authenticateUser, Added.see_questions_screen);

router.get('/questions', authenticateUser, Added.getAllQuestions);

router.get('/exam-questions-grouped', authenticateUser, Added.getAllQuestionsGroupedByExam);



module.exports = router;