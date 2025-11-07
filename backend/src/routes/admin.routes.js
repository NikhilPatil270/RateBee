const express = require('express');
const { authMiddleware, authorize } = require('../middleware/auth');
const admin = require('../controllers/admin.controller');
const router = express.Router();

router.use(authMiddleware, authorize(['ADMIN']));

router.get('/dashboard', admin.getDashboardStats);
router.post('/users', admin.createuser);
router.get('/users', admin.listUsers);
router.get('/stores', admin.listStores);

module.exports = router;


