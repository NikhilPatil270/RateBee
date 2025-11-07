const express = require('express');
const { authMiddleware, authorize } = require('../middleware/auth');
const stores = require('../controllers/stores.controller');
const router = express.Router();

router.get('/', authMiddleware, stores.listStores);
router.post('/', authMiddleware, authorize(['ADMIN']), stores.createStore);

module.exports = router;
