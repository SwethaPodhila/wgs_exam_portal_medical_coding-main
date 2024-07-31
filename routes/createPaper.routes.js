
const express = require('express');
const router = express.Router();
const createPaper = require('../controller/createPaper.controller');
const authenticateUser = require('../middleware/authentication');

router.get('/paper', authenticateUser, createPaper.see_paper_screen);

module.exports = router;
