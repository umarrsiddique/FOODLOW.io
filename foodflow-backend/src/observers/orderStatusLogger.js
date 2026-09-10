const orderNotifier = require('./orderNotifier');

// Replaces OrderStatusLogger implements OrderObserver.
// Subscribing here (module load time) replaces the constructor-time
// `orderNotifier.addObserver(orderStatusLogger)` wiring that Spring's DI did in OrderService.
orderNotifier.on('orderStatusChanged', ({ orderId, newStatus }) => {
  console.log(`📦 Order #${orderId} status changed to: ${newStatus}`);
});
