const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');


router.post('/reset-password', authController.resetPassword);
router.post('/change-password', auth, authController.changePassword);
router.get('/validate-token/:token', authController.validateResetToken);
router.post("/register", authController.register);
router.post("/login", authController.login);


// En authController.js
exports.validateResetToken = async (req, res) => {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user || user.resetPasswordToken !== token || Date.now() > user.resetPasswordExpires) {
        return res.status(400).send("Token inválido o expirado");
      }
  
      // Redirige al HTML para cambiar la contraseña
      res.redirect(`/change-password.html?token=${token}&email=${user.email}`);
    } catch (error) {
      res.status(400).send("Token inválido");
    }
  };
  

module.exports = router;
