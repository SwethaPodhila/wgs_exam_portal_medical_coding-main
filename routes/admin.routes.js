
const express = require('express');
const router = express.Router();
const Admin = require('../controller/admin.controller');
const authenticateUser = require('../middleware/authentication');


router.get('/dashboard', authenticateUser, Admin.admin_dashboard);
router.get('/approve/students', authenticateUser, Admin.approveStudentLogins);

router.put('/users/:userId/approve', Admin.approveUser);

// Route to reject a user
router.put('/users/:userId/reject', Admin.rejectUser);

module.exports = router;
