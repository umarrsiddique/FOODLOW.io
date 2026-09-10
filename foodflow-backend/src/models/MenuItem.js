const mongoose = require('mongoose');
const idTransform = require('../utils/idTransform');

// Equivalent to @Entity @Table(name = "menu_items") class MenuItem.
// The `restaurant` field replaces @ManyToOne @JoinColumn(name = "restaurant_id").
const menuItemSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    emoji: String,
    category: String,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  },
  { timestamps: false, ...idTransform }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
