const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');

// Rota de cadastro de usuário / empresa
router.post('/cadastro', usuarioController.cadastrarUsuario);

// Rota para listar todos os usuários misturados
router.get('/', usuarioController.listarUsuarios);

// Rotas específicas para listar separados por tipo (Role)
router.get('/funcionarios', usuarioController.listarFuncionarios);
router.get('/empresas', usuarioController.listarEmpresas);

module.exports = router;
