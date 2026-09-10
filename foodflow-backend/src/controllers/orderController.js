const orderService = require('../services/orderService');

// Replaces OrderController.java

async function getAllOrders(req, res, next) {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function placeOrder(req, res, next) {
  try {
    const { customerName, items, total, restaurantId, address, phone } = req.body;
    const deliveryType = req.body.deliveryType || 'standard'; // same default as Java version

    const order = await orderService.placeOrder(
      customerName,
      items,
      total,
      restaurantId,
      address,
      phone,
      deliveryType
    );
    res.json(order);
  } catch (err) {
    next(err);
  }
}

// New - public order lookup, used by the customer's "track my order" view.
async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (order) return res.json(order);
    return res.status(404).end();
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const updated = await orderService.updateOrderStatus(req.params.id, status);
    if (updated) return res.json(updated);
    return res.status(404).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllOrders,
  placeOrder,
  getOrderById,
  updateStatus,
};
