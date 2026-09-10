// Unlike Sequelize, Mongoose refs are declared directly inside each schema
// (see the `restaurant` field in MenuItem.js and Order.js), so there's no
// separate association-wiring step needed here - this file just re-exports.
const Restaurant = require('./Restaurant');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const Admin = require('./Admin');

module.exports = { Restaurant, MenuItem, Order, Admin };
