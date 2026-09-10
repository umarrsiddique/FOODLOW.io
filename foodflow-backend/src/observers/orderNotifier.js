const EventEmitter = require('events');

// OBSERVER PATTERN
// Replaces: OrderNotifier (subject) + OrderObserver (interface)
// Node's EventEmitter IS the Observer pattern from the standard library, so there's
// no need to hand-roll an observer list like the Java version did.
//
// addObserver(observer)         -> orderNotifier.on('orderStatusChanged', fn)
// notifyObservers(id, status)   -> orderNotifier.emit('orderStatusChanged', { orderId, newStatus })
class OrderNotifier extends EventEmitter {}

// Exported as a singleton, mirroring the Spring @Component (one shared instance app-wide).
module.exports = new OrderNotifier();
