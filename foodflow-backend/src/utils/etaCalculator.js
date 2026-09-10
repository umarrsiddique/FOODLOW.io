// Real ETA engine - not a fake progress bar. Estimated minutes are computed from:
//   1. Base kitchen prep time
//   2. How many active (not-yet-delivered) orders are ahead of this one at the same restaurant
//   3. The delivery leg time, which depends on the Strategy pattern's deliveryType
//
// This runs once when an order is placed, and gets recomputed whenever its status changes
// (moving from "Pending" to "Preparing" means the kitchen queue wait is over, for example).

const BASE_PREP_MINUTES = 10;
const PER_QUEUED_ORDER_MINUTES = 4;
const DELIVERY_LEG_MINUTES = {
  standard: 25,
  express: 12,
};

function deliveryMinutesFor(deliveryType) {
  return DELIVERY_LEG_MINUTES[deliveryType] ?? DELIVERY_LEG_MINUTES.standard;
}

/**
 * Called when an order is first placed. queueDepth = number of active orders
 * already ahead of it at the same restaurant.
 */
function calculateInitialEta({ queueDepth, deliveryType }) {
  return BASE_PREP_MINUTES + queueDepth * PER_QUEUED_ORDER_MINUTES + deliveryMinutesFor(deliveryType);
}

/**
 * Called whenever an admin changes an order's status. As the order moves through
 * the pipeline, the remaining wait shrinks - it no longer needs to wait behind
 * other kitchen orders once it's actually being prepared or out the door.
 */
function recalculateEtaForStatus(order) {
  const deliveryMinutes = deliveryMinutesFor(order.deliveryType);
  if (order.status === 'Delivered') return 0;
  if (order.status === 'Preparing') return deliveryMinutes; // kitchen queue wait is over
  return order.estimatedMinutes; // still "Pending" - keep the original estimate
}

module.exports = { calculateInitialEta, recalculateEtaForStatus };
