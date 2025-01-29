const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const User = require("../models/User");

const handelDuplicate = async (req, res, next) => {
    const { username, email } = req.body;
    const errors = {};

    try {
        if (username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {

                errors.duplicate = { ...errors.duplicate }
                errors.duplicate.username = 'Username already exists';
            }
        }

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                errors.duplicate = { ...errors.duplicate }
                errors.duplicate.email = 'Email already exists';
            }
        }

        if (errors.duplicate) {
            return res.status(409).json({ error: errors });
        } else{
            next();
        }

    } catch (error) {
        res.status(500).json({ error, msg: "123" });
    }
};

// register
router.post('/register', handelDuplicate, userController.register);
// login
router.post('/login', userController.login);

router.get('/me', authenticateToken, userController.getUserFromToken);

module.exports = router;
