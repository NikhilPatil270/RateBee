const express = require('express');
const { authMiddleware, authorize } = require('../middleware/auth');
const owner = require('../controllers/owner.controller');
const router = express.Router();

router.get('/dashboard', authMiddleware, authorize(['STORE_OWNER']), owner.ownerDashboard);

module.exports = router;


