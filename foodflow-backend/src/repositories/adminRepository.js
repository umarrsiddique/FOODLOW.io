const Admin = require('../models/Admin');

// New - didn't exist in the Java version.
module.exports = {
  findByUsername: (username) => Admin.findOne({ username }),
  count: () => Admin.countDocuments(),
  create: (data) => Admin.create(data),
};
