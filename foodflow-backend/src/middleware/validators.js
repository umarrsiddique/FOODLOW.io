const mongoose = require('mongoose');

// New - didn't exist before. Runs after requireAdmin, before the controller, so bad
// input never reaches the database. Mongoose is loose about types at the JS layer
// (a string "abc" passed for a Number field gets cast to NaN silently rather than
// rejected), so this is the actual line of defense against malformed data.

function validateMenuItem(req, res, next) {
  const { name, price, restaurantId } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('name is required and must be a non-empty string');
  }

  if (price === undefined || price === null || Number.isNaN(Number(price)) || Number(price) < 0) {
    errors.push('price is required and must be a non-negative number');
  }

  if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
    errors.push('restaurantId is required and must be a valid restaurant id');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
}

function validateRestaurant(req, res, next) {
  const { name, rating, deliveryFee } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('name is required and must be a non-empty string');
  }

  if (rating !== undefined && (Number.isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)) {
    errors.push('rating must be a number between 0 and 5');
  }

  if (deliveryFee !== undefined && (Number.isNaN(Number(deliveryFee)) || Number(deliveryFee) < 0)) {
    errors.push('deliveryFee must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
}

module.exports = { validateMenuItem, validateRestaurant };
