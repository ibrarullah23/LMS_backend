const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const attendenceController = require('../controllers/attendenceController');
const {authenticateAdminToken} = require('../middlewares/authMiddleware');

// const authenticateAdminToken = (req, res, next)  => {
//     next();
// };

// admin 
//     students , classes , newclass , classAttendance
//         !         !         !            !
// get all students
router.get('/students', userController.getAllUsers);
// get all classes
router.get('/classes', authenticateAdminToken , attendenceController.getAllClasses);
// Add new Class
router.post('/classes', authenticateAdminToken , attendenceController.addClass);
// get attendance of the specific class
router.get('/attendance/ofclass/:id', authenticateAdminToken , attendenceController.getAttendanceofClass);


module.exports = router;
