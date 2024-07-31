const express = require('express');
const router = express.Router();
const Teacher = require('../controller/teacher.controller');
const authenticateUser = require('../middleware/authentication');

router.get('/dashboard', authenticateUser, Teacher.teacher_dashboard);

// Logout route
router.post('/logout', authenticateUser, (req, res) => {
    req.logout(); 
    res.redirect('/login'); 
});

module.exports = router;