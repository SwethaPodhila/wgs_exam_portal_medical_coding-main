
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const paperController = require('../controller/paper.controller');
const questionsController = require('../controller/questions.controller');

router.get('/paper', authenticateUser, paperController.renderPaper);

router.post('/papers', authenticateUser, paperController.createPaper);

router.get('/papers', authenticateUser, paperController.getAllPapers);

router.get('/paper/:paperId', authenticateUser, questionsController.getQuestionsByPaperId);

router.get('/papers/:id', authenticateUser, paperController.getPaperById);

router.put('/papers/:id', authenticateUser, paperController.updatePaper);

router.delete('/papers/:id', authenticateUser, paperController.deletePaper);

router.get('/courses/:course_id/papers', paperController.getPapersByCourse);

module.exports = router;
