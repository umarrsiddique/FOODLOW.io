// FACTORY PATTERN
// Replaces OrderFactory.createOrder(...). Centralizes how a "new order" object
// is assembled before it's persisted, same role it played in the Java version.
function createOrder({
  customerName,
  items,
  total,
  deliveryFee,
  restaurantId,
  address,
  phone,
  deliveryType,
  estimatedMinutes,
}) {
  return {
    customerName,
    items,
    total,
    deliveryFee,
    restaurantId,
    address,
    phone,
    deliveryType,
    estimatedMinutes,
    // status defaults to 'Pending' at the model level, same as the old @PrePersist
  };
}

module.exports = { createOrder };
