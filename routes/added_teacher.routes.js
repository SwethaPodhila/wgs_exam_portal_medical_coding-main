const express = require('express');
const router = express.Router();
const AddedTeacher = require('../controller/added_teacher.controller');
const authenticateUser = require('../middleware/authentication');

// Take exam screen route (requires authentication)
router.get('/teacher-questions', authenticateUser, AddedTeacher.see_teacher_screen);

router.get('/questions', authenticateUser, AddedTeacher.getAllQuestions);

router.get('/exam-questions-grouped', authenticateUser, AddedTeacher.getAllQuestionsGroupedByExam);



module.exports = router;