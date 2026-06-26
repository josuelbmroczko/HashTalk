const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);
router.use(authMiddleware.verifyUserExists);
router.use(authMiddleware.extractUserInfo);

// Rotas de posts
router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.get('/colegas', postController.getPostsColegas);
router.get('/me', postController.getMyPosts);
router.get('/me/comments', postController.getCommentsByUsuario);
router.get('/me/likes', postController.getLikedPostsByUsuario);
router.get('/usuario/:id', postController.getPostsByUsuario);
router.get('/usuario/:id/comments', postController.getCommentsByUsuario);
router.get('/usuario/:id/likes', postController.getLikedPostsByUsuario);
router.get('/empresa/:empresaId', postController.getPostsByEmpresa);
router.get('/empresa/nome/:nomeEmpresa', postController.getPostsByEmpresaNome);
router.get('/hashtag/:hashtag', postController.getPostsByHashtag);
router.delete('/:postId', postController.deletePost);
router.post('/:id/like', postController.likePost);
router.post('/:id/comment', postController.commentPost);

module.exports = router;
