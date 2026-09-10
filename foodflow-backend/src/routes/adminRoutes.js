const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// New - didn't exist in the Java version. No signup route on purpose -
// the one admin account is seeded automatically on server start.

router.post('/login', adminController.login);
router.get('/me', requireAdmin, adminController.me);

module.exports = router;
