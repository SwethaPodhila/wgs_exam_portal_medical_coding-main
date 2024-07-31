const express = require('express');
const router = express.Router();
const Question = require('../controller/questions.controller');
const authenticateUser = require('../middleware/authentication');

router.post('/questions', authenticateUser, Question.createQuestion);

router.get('/questions', authenticateUser, Question.getAllQuestions);

router.get('/questions-teacher', authenticateUser, Question.getAllQuestionsByTeacher);

router.get('/exam-questions-grouped', authenticateUser, Question.getAllQuestionsGroupedByExam);

router.get('/exam-questions-all', authenticateUser, Question.getAllQuestionsByExam);

router.get('/questions/:id', authenticateUser, Question.getQuestionById);

router.put('/questions/:id', authenticateUser, Question.updateQuestion);

router.delete('/questions/:id', authenticateUser, Question.deleteQuestion);

router.get('/exam-questions', authenticateUser, Question.getAllQuestionsByCriteria);

module.exports = router;
