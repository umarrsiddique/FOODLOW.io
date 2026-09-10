const orderNotifier = require('./orderNotifier');
const { getIO } = require('../sockets/io');

// This is the same OBSERVER PATTERN as orderStatusLogger.js - it's a second listener
// on the exact same orderNotifier subject. Where orderStatusLogger just logs to the
// console, this one pushes the update to any browser currently watching that order,
// over a WebSocket room scoped to that order's id.
orderNotifier.on('orderStatusChanged', ({ orderId, newStatus, estimatedMinutes }) => {
  const io = getIO();
  if (!io) return; // socket.io not initialized yet (e.g. during tests) - fail silently

  io.to(`order:${orderId}`).emit('orderUpdate', {
    orderId,
    status: newStatus,
    estimatedMinutes,
  });
});
