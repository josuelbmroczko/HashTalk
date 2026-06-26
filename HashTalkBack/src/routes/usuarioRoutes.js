const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);
router.use(authMiddleware.verifyUserExists);

// Rotas de usuários
router.get('/', usuarioController.listarUsuarios);
router.get('/colegas', usuarioController.listarColegas);
router.get('/search', usuarioController.buscarUsuarios);
router.get('/relacionamentos', usuarioController.listarRelacionamentos);
router.get('/:id', usuarioController.getPerfilUsuario);
router.post('/:id/follow', usuarioController.toggleFollow);

module.exports = router;
