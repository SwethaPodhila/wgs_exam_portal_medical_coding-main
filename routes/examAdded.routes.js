const express = require('express');
const router = express.Router();
const ExamAdded = require('../controller/examAdded.controller');
const authenticateUser = require('../middleware/authentication');

router.get('/examing', authenticateUser, ExamAdded.see_exams_screen);


module.exports = router;
