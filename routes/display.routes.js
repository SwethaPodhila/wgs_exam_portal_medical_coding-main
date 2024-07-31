const express = require('express');
const router = express.Router();
const Question = require('../controller/questions.controller');
const authenticateUser = require('../middleware/authentication');


router.get('/display', authenticateUser, async (req, res) => {
    try {
        const questions = await Question.getAllQuestions(req, res);
        res.render('display_questions', { questions: questions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;