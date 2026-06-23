const express = require('express');
const router = express.Router();
const hashtagController = require('../controller/hashtagController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);
router.use(authMiddleware.verifyUserExists);
router.use(authMiddleware.extractUserInfo);

router.post('/', hashtagController.createHashtags);
router.get('/', hashtagController.getAllHashtags);
router.get('/top', hashtagController.getTopHashtags);
router.get('/:hashtag/posts', hashtagController.getPostsByHashtag);

module.exports = router;
