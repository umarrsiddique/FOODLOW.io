const orderRepository = require('../repositories/orderRepository');
const restaurantRepository = require('../repositories/restaurantRepository');
const orderFactory = require('../factories/orderFactory');
const orderNotifier = require('../observers/orderNotifier');
const { getDeliveryFeeStrategy } = require('../strategies/deliveryFeeStrategy');
const { calculateInitialEta, recalculateEtaForStatus } = require('../utils/etaCalculator');

// Replaces OrderService.java.
// FACADE - same role as the Java version: hides Factory + Strategy + Observer
// wiring behind two simple methods (placeOrder, updateOrderStatus).

async function placeOrder(customerName, items, total, restaurantId, address, phone, deliveryType) {
  const restaurant = await restaurantRepository.findById(restaurantId);
  const resolvedRestaurantId = restaurant ? restaurant.id : restaurantId;

  const calculateFee = getDeliveryFeeStrategy(deliveryType); // STRATEGY
  const deliveryFee = calculateFee(total);

  // How many active orders are already ahead of this one in the kitchen queue,
  // used to compute a real ETA instead of a fake static number.
  const activeOrders = await orderRepository.findActiveByRestaurant(resolvedRestaurantId);
  const estimatedMinutes = calculateInitialEta({ queueDepth: activeOrders.length, deliveryType });

  const orderData = orderFactory.createOrder({
    // FACTORY
    customerName,
    items,
    total,
    deliveryFee,
    restaurantId: resolvedRestaurantId,
    address,
    phone,
    deliveryType,
    estimatedMinutes,
  });

  const saved = await orderRepository.create(orderData);

  orderNotifier.emit('orderStatusChanged', {
    orderId: saved.id,
    newStatus: saved.status,
    estimatedMinutes: saved.estimatedMinutes,
  }); // OBSERVER - fans out to both the console logger and the WebSocket broadcaster

  return saved;
}

async function getAllOrders() {
  return orderRepository.findAll();
}

// New - powers the public "track my order" view (no admin auth required).
async function getOrderById(id) {
  return orderRepository.findByIdWithRestaurant(id);
}

async function updateOrderStatus(id, status) {
  const order = await orderRepository.findById(id);
  if (!order) return null;

  order.status = status;
  order.estimatedMinutes = recalculateEtaForStatus(order);
  await order.save();

  orderNotifier.emit('orderStatusChanged', {
    orderId: order.id,
    newStatus: order.status,
    estimatedMinutes: order.estimatedMinutes,
  }); // OBSERVER

  return order;
}

module.exports = {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
