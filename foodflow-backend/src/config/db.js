const mongoose = require('mongoose');
require('dotenv').config();

// Replaces spring.datasource.* / the Sequelize Postgres config.
async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
}

module.exports = connectDB;
