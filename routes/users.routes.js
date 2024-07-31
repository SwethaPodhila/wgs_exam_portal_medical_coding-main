var express = require('express');
var router = express.Router();
const user_controller = require('../controller/users.controller');
const authenticateUser = require('../middleware/authentication');

router.get('/teacher/login', user_controller.login_screen_teacher);
router.get('/student/login', user_controller.login_screen_student);
router.get('/admin/login', user_controller.login_screen_admin);

router.get('/teacher/sign-up', user_controller.register_screen_teacher);
router.get('/student/sign-up', user_controller.register_screen_student);
router.get('/admin/sign-up', user_controller.register_screen_admin);

router.post('/sign-up', user_controller.signup);
router.post('/login', user_controller.login);

router.post('/logout', authenticateUser, user_controller.logout);

router.get('/counts', user_controller.getCounts);

router.get('/learners', user_controller.listStudents); 
router.get('/learners/edit/:id', user_controller.editStudentForm); 
router.post('/learners/edit/:id', user_controller.updateStudent); 
router.post('/learners/delete/:id', user_controller.deleteStudent); 


//router.post('/logout', user_controller.logout);

module.exports = router;
