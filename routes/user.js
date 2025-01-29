const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const attendenceController = require('../controllers/attendenceController');
const {authenticateToken, authenticateuser} = require('../middlewares/authMiddleware');

// const authenticateToken = (req, res, next)  => {
//     next();
// };
// const authenticateuser = (req, res, next)  => {
//     next();
// };

// user 
//     stuclasses, Profile, update mark , login / register
//          !         !      !        !       !      !
// profile
router.get('/', authenticateToken, userController.getUserbyId);
router.patch('/', authenticateuser, userController.updateProfile);
// attndance/classes of student
router.get('/attendance/:id', authenticateToken, attendenceController.getAttendanceByStuId);
//  mark attendance as 'Present'
router.patch('/mark', authenticateuser, attendenceController.updateAttendanceStatus);

module.exports = router;
