// STRATEGY PATTERN
// Replaces: DeliveryFeeStrategy (interface) + StandardDeliveryStrategy + ExpressDeliveryStrategy
// In JS, an interface with one method per implementation is naturally just a function.
// Each key below is one interchangeable "strategy".

const strategies = {
  standard: (orderTotal) => {
    // Free delivery for orders above Rs. 1500
    if (orderTotal > 1500) return 0;
    return 100;
  },
  express: (_orderTotal) => {
    // Express delivery always charges Rs. 200
    return 200;
  },
};

/**
 * Equivalent to: DeliveryFeeStrategy strategy = deliveryType.equals("express")
 *                  ? new ExpressDeliveryStrategy() : new StandardDeliveryStrategy();
 */
function getDeliveryFeeStrategy(deliveryType) {
  return strategies[deliveryType] || strategies.standard;
}

module.exports = { getDeliveryFeeStrategy };
