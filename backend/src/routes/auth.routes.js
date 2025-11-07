const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/change-password', authorize,authController.changePassword);

module.exports = router;
