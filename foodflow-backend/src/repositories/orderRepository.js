const Order = require('../models/Order');

// Replaces: interface OrderRepository extends JpaRepository<Order, Long>
module.exports = {
  findAll: () => Order.find().populate('restaurant').sort({ createdAt: -1 }),

  findById: (id) => Order.findById(id),

  // New - used to look up a single order for the public "track my order" view.
  findByIdWithRestaurant: (id) => Order.findById(id).populate('restaurant'),

  // New - powers the ETA engine: counts orders at this restaurant that aren't
  // Delivered yet, i.e. how many are ahead of a brand new order in the kitchen queue.
  findActiveByRestaurant: (restaurantId) =>
    Order.find({ restaurant: restaurantId, status: { $ne: 'Delivered' } }),

  // Accepts `restaurantId` (as produced by orderFactory.createOrder) and maps it
  // onto the schema's `restaurant` reference field.
  create: ({
    customerName,
    items,
    total,
    deliveryFee,
    restaurantId,
    restaurant,
    address,
    phone,
    deliveryType,
    estimatedMinutes,
  }) =>
    Order.create({
      customerName,
      items,
      total,
      deliveryFee,
      restaurant: restaurant || restaurantId,
      address,
      phone,
      deliveryType,
      estimatedMinutes,
    }),
};
