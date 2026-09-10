const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAdmin } = require('../middleware/auth');

// Replaces @RequestMapping("/api/orders") in OrderController.java

router.get('/', requireAdmin, orderController.getAllOrders); // admin dashboard only
router.get('/:id', orderController.getOrderById); // public - customers track their own order by id
router.post('/', orderController.placeOrder); // public - customers place orders without login
router.put('/:id/status', requireAdmin, orderController.updateStatus); // admin only

module.exports = router;
