const restaurantService = require('../services/restaurantService');

// Replaces RestaurantController.java

async function getAllRestaurants(req, res, next) {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.json(restaurants);
  } catch (err) {
    next(err);
  }
}

async function getRestaurantById(req, res, next) {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    if (restaurant) return res.json(restaurant);
    return res.status(404).end();
  } catch (err) {
    next(err);
  }
}

async function addRestaurant(req, res, next) {
  try {
    const saved = await restaurantService.saveRestaurant(req.body);
    res.json(saved);
  } catch (err) {
    next(err);
  }
}

async function deleteRestaurant(req, res, next) {
  try {
    await restaurantService.deleteRestaurant(req.params.id);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  addRestaurant,
  deleteRestaurant,
};
