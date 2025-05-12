const express = require('express');
const router = express.Router();
const {
    login,
    register,
    requestPasswordReset,
    resetPassword,
    verifyToken
} = require('../controllers/authController');

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/confirm', resetPassword);
router.get('/verify', verifyToken);

module.exports = router;