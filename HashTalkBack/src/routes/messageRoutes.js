const express = require('express');
const router = express.Router();
const messageController = require('../controller/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);
router.use(authMiddleware.verifyUserExists);

// Rotas de mensagens
router.get('/conversations', messageController.listarConversas);
router.get('/:userId', messageController.listarMensagensComUsuario);
router.post('/', messageController.enviarMensagem);

module.exports = router;
