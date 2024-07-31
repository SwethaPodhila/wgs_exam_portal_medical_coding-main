const express = require('express');
const router = express.Router();
const Names = require('../controller/names.controller');
const authenticateUser = require('../middleware/authentication');

router.get('/name', authenticateUser, Names.see_course_screen);


module.exports = router;
