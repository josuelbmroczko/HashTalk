const express = require('express');
const router = express.Router();

const hashtagController = require('../controller/hashtagController');
router.post("/",hashtagController.createHashyags)

module.exports = router;