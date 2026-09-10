const mongoose = require('mongoose');
const idTransform = require('../utils/idTransform');

// New - didn't exist in the Java version. Holds admin login credentials only.
const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, ...idTransform }
);

module.exports = mongoose.model('Admin', adminSchema);
