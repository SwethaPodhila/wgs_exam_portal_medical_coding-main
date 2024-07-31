const express = require('express');
const router = express.Router();
const Template = require('../controller/template.controller');
const authenticateUser = require('../middleware/authentication');

// Take exam screen route (requires authentication)
router.get('/lobby/exam', authenticateUser, Template.take_exam_screen);

module.exports = router;

/*
const express = require('express');
const router = express.Router();
const Template = require('../controller/template.controller');

router.get('/lobby/exam', Template.take_exam_screen);

module.exports = router;
*/