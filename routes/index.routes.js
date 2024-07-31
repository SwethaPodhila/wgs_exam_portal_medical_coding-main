var express = require('express');
const authenticateUser = require('../middleware/authentication');
var router = express.Router();

router.get('/', authenticateUser, function (req, res, next) {
    const questions = []; 
    res.render('index', { title: 'Express', questions: questions });
});

module.exports = router;
