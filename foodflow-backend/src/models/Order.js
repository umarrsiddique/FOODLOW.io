const mongoose = require('mongoose');
const idTransform = require('../utils/idTransform');

// Equivalent to @Entity @Table(name = "orders") class Order.
const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    items: String,
    total: Number,
    status: {
      type: String,
      default: 'Pending', // replaces the @PrePersist that set status = "Pending"
    },
    deliveryFee: Number,
    address: String,
    phone: String,
    deliveryType: String,
    estimatedMinutes: Number, // powers the live ETA shown on the customer's tracking view
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  },
  {
    // replaces the @PrePersist that manually set createdAt = LocalDateTime.now()
    timestamps: { createdAt: true, updatedAt: false },
    ...idTransform,
  }
);

module.exports = mongoose.model('Order', orderSchema);
