const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const path = require("path");

router.get('/validate-token/:token', authController.validateResetToken);
router.get('/verify-token', authController.verifyToken);
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/login.html"));
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/reset-password', auth,   authController.resetPassword);
router.post('/change-password', auth,   authController.changePassword);
router.post('/reset-request', authController.requestPasswordReset);



module.exports = router;
