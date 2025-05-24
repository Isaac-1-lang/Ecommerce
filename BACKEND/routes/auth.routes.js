const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh', authMiddleware, authController.refreshSession);

module.exports = router; 