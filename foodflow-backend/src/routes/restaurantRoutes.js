const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { requireAdmin } = require('../middleware/auth');
const { validateRestaurant } = require('../middleware/validators');

// Replaces @RequestMapping("/api/restaurants") in RestaurantController.java

router.get('/', restaurantController.getAllRestaurants); // public
router.get('/:id', restaurantController.getRestaurantById); // public

router.post('/', requireAdmin, validateRestaurant, restaurantController.addRestaurant); // admin only
router.delete('/:id', requireAdmin, restaurantController.deleteRestaurant); // admin only

module.exports = router;
