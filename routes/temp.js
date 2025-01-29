const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const attendenceController = require('../controllers/attendenceController');
// const {authenticateToken, authenticateAdminToken, authenticateuser} = require('../middlewares/authMiddleware');
const authenticateToken = (req, res, next)  => {
    next();
};
const authenticateAdminToken = (req, res, next)  => {
    next();
};
const authenticateuser = (req, res, next)  => {
    next();
};

// register
router.post('/register', userController.register);
// login
router.post('/login', userController.login);


// attendance
// router.get('/stats', authenticateToken, attendenceController.getAttendanceCount);

// user 
//     stuclasses, Profile, update mark , login / register
//          !         !      !        !       !      !
// profile
router.get('/profile/:id', authenticateToken, userController.getUserbyId);
router.patch('/profile', authenticateuser, userController.updateProfile);
// attndance/classes of student
router.get('/attendance/:id', authenticateToken, attendenceController.getAttendanceByStuId);
//  mark attendance as 'Present'
router.patch('/mark', authenticateToken, attendenceController.updateAttendanceStatus);

// admin 
//     students , classes , newclass , classAttendance
//         !         !         !            !
// get all students
router.get('/students', authenticateAdminToken , userController.getAllUsers);
// get all classes
router.get('/classes', authenticateAdminToken , attendenceController.getAllClasses);
// Add new Class
router.post('/classes', authenticateAdminToken , attendenceController.addClass);
// get attendance of the specific class
router.get('/attendance/ofclass/:id', authenticateAdminToken , attendenceController.getAttendanceofClass);


// view
// router.get('/students', authenticateToken, userController.getAllUsers);
// router.get('/student/:id', authenticateToken, userController.getUserbyId);

// update
// router.patch('/update-profile', authenticateToken, userController.updateProfile);



// router.post('/mark-attendance', authenticateToken, userController.markAttendance);
// router.post('/submit-leave-request', authenticateToken, userController.submitLeaveRequest);
// router.get('/attendance-records/:userId', authenticateToken, userController.getAttendanceRecords);
// router.patch('/update-profile', authenticateToken, userController.updateProfile);

module.exports = router;
