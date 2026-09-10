const restaurantRepository = require('../repositories/restaurantRepository');

// Replaces RestaurantService.java
async function getAllRestaurants() {
  return restaurantRepository.findAll();
}

async function getRestaurantById(id) {
  return restaurantRepository.findById(id);
}

async function saveRestaurant(restaurant) {
  return restaurantRepository.create(restaurant);
}

async function deleteRestaurant(id) {
  return restaurantRepository.deleteById(id);
}

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  saveRestaurant,
  deleteRestaurant,
};
