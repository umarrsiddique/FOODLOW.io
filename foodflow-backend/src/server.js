require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const adminService = require('./services/adminService');
const { setIO } = require('./sockets/io');
require('./observers/orderStatusLogger'); // attaches the console-logging Observer - must run once at startup
require('./observers/orderSocketBroadcaster'); // attaches the WebSocket-broadcasting Observer - same subject, second listener

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Replaces @CrossOrigin(origins = "http://localhost:5173") on every controller
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Replaces each @RequestMapping("/api/...") base path
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

// Express needs to run on a plain http.Server (not app.listen directly) so that
// socket.io can attach to the same underlying server and share the same port.
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:5173' },
});

io.on('connection', (socket) => {
  // A customer's browser calls socket.emit('joinOrder', orderId) after placing an
  // order (or when opening "My Orders"), so it only receives updates for orders it
  // actually placed - not every order in the system.
  socket.on('joinOrder', (orderId) => {
    socket.join(`order:${orderId}`);
  });
});

setIO(io); // makes this instance available to observers/orderSocketBroadcaster.js

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    await connectDB();
    console.log('✅ MongoDB connection established');
    // No schema sync step needed - MongoDB is schemaless at the DB level;
    // Mongoose only enforces structure at the application layer.

    await adminService.seedAdminIfNeeded();

    server.listen(PORT, () => {
      console.log(`🚀 FoodFlow backend running on http://localhost:${PORT}`);
      console.log(`🔌 WebSocket server ready for live order tracking`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
