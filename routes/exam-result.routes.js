const express = require('express');
const router = express.Router();
const ExamResult = require('../controller/exam-result.controller');
const authenticateUser = require('../middleware/authentication');

// Routes for managing exam results
router.post('/exam-results', authenticateUser, ExamResult.createExamResult);
router.get('/exam-results', authenticateUser, ExamResult.getAllExamResults);
router.get('/exam-results/options', authenticateUser, ExamResult.getExamResultsWithOptions);
router.get('/exam-results/:id', authenticateUser, ExamResult.getExamResultById);
router.put('/exam-results/:id', authenticateUser, ExamResult.updateExamResult);
router.delete('/exam-results/:id', authenticateUser, ExamResult.deleteExamResult);

module.exports = router;


/*

const express = require('express');
const router = express.Router();
const ExamResult = require('../controller/exam-result.controller');
const authenticateUser = require('../middleware/authentication');

router.post('/exam-results', authenticateUser, ExamResult.createExamResult);

router.get('/exam-results', authenticateUser, ExamResult.getAllExamResults);

router.get('/exam-results/:id', authenticateUser, ExamResult.getExamResultById);

router.put('/exam-results/:id', authenticateUser, ExamResult.updateExamResult);

router.delete('/exam-results/:id', authenticateUser, ExamResult.deleteExamResult);


module.exports = router;
*/