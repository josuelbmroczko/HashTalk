const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);
router.use(authMiddleware.verifyUserExists);

// Rotas de usuários
router.get('/colegas', usuarioController.listarColegas);
router.get('/:id', usuarioController.getPerfilUsuario);

module.exports = router;
