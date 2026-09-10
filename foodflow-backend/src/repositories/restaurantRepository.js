const Restaurant = require('../models/Restaurant');

// Replaces: interface RestaurantRepository extends JpaRepository<Restaurant, Long>
module.exports = {
  findAll: () => Restaurant.find(),
  findById: (id) => Restaurant.findById(id),
  create: (data) => Restaurant.create(data),
  deleteById: (id) => Restaurant.findByIdAndDelete(id),
};
