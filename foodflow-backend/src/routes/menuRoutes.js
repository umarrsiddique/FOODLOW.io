const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const { requireAdmin } = require('../middleware/auth');
const { validateMenuItem } = require('../middleware/validators');

// Replaces @RequestMapping("/api/menu") in MenuItemController.java

router.get('/', menuItemController.getAllMenuItems); // public
router.get('/restaurant/:restaurantId', menuItemController.getMenuByRestaurant); // public

router.post('/', requireAdmin, validateMenuItem, menuItemController.addMenuItem); // admin only
router.put('/:id', requireAdmin, validateMenuItem, menuItemController.updateMenuItem); // admin only
router.delete('/:id', requireAdmin, menuItemController.deleteMenuItem); // admin only

module.exports = router;
