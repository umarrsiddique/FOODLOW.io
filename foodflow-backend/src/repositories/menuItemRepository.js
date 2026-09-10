const MenuItem = require('../models/MenuItem');

// Replaces: interface MenuItemRepository extends JpaRepository<MenuItem, Long>
module.exports = {
  findAll: () => MenuItem.find().populate('restaurant'),

  // Replaces: List<MenuItem> findByRestaurantId(Long restaurantId);
  findByRestaurantId: (restaurantId) => MenuItem.find({ restaurant: restaurantId }).populate('restaurant'),

  findById: (id) => MenuItem.findById(id),

  // Accepts either `restaurantId` (flat, from the frontend) or `restaurant` and
  // maps it onto the schema's `restaurant` reference field.
  create: ({ name, description, price, emoji, category, restaurantId, restaurant }) =>
    MenuItem.create({ name, description, price, emoji, category, restaurant: restaurant || restaurantId }),

  deleteById: (id) => MenuItem.findByIdAndDelete(id),
};
