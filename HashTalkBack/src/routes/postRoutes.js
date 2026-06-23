const express = require('express');
const router = express.Router();

const postController = require('../controller/postController');

router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.get('/usuario/:id', postController.getPostsByUsuario);
router.get('/empresa/:id', postController.getPostsByEmpresa);

module.exports = router;