const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const admin = require('../controllers/admin.controller');
const router = express.Router();

router.use(authenticate, authorize(['ADMIN']));

router.get('/dashboard', admin.getDashboardStats);
router.post('/users', admin.createUser);
router.get('/users', admin.listUsers);
router.get('/stores', admin.listStores);

module.exports = router;


