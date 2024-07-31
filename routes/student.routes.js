const express = require('express');
const router = express.Router();
const Student = require('../controller/student.controller');
const authenticateUser = require('../middleware/authentication');

router.get('/dashboard', authenticateUser, Student.student_dashboard);

// Logout route
router.post('/logout', authenticateUser, (req, res) => {
    req.logout(); 
    res.redirect('/login'); 
});

module.exports = router;

/*
const express = require('express');
const router = express.Router();
const Student = require('../controller/student.controller');
const authenticateUser = require('../middleware/authentication');
const authorizeUser = require('../middleware/authorization');


router.get('/dashboard', authenticateUser, Student.student_dashboard);

module.exports = router;
*/


