const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const { requireAdmin } = require('../middleware/auth');

// Replaces @RequestMapping("/api/menu") in MenuItemController.java

router.get('/', menuItemController.getAllMenuItems); // public
router.get('/restaurant/:restaurantId', menuItemController.getMenuByRestaurant); // public

router.post('/', requireAdmin, menuItemController.addMenuItem); // admin only
router.put('/:id', requireAdmin, menuItemController.updateMenuItem); // admin only
router.delete('/:id', requireAdmin, menuItemController.deleteMenuItem); // admin only

module.exports = router;
