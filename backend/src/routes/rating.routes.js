const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const ratings = require('../controllers/ratings.controller');
const router = express.Router();

router.post('/', authMiddleware, ratings.ratings);

module.exports = router;


