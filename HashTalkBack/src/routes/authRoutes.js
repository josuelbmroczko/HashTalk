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
  authController.getMe
);

router.put('/me',
  authMiddleware.verifyToken,
  authMiddleware.verifyUserExists,
  authController.updateMe
);

module.exports = router;