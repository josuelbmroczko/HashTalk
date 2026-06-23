const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/verify', authController.verifyToken);
router.post('/logout', authMiddleware.verifyToken, authController.logout);

// Rota de teste para verificar autenticação
router.get('/me', 
  authMiddleware.verifyToken,
  authMiddleware.verifyUserExists,
  authMiddleware.extractUserInfo,
  (req, res) => {
    res.json({
      message: 'Usuário autenticado',
      usuario: req.userInfo
    });
  }
);

module.exports = router;