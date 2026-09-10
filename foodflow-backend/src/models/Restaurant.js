const mongoose = require('mongoose');
const idTransform = require('../utils/idTransform');

// Equivalent to @Entity @Table(name = "restaurants") class Restaurant
const restaurantSchema = new mongoose.Schema(
  {
    name: String,
    emoji: String,
    cuisine: String,
    rating: Number,
    deliveryTime: String,
    deliveryFee: Number,
    status: String,
    color: String,
  },
  { timestamps: false, ...idTransform }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
