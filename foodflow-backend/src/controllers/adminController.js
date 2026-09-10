const adminService = require('../services/adminService');

// New - didn't exist in the Java version.

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }

    const token = await adminService.login(username, password);
    if (!token) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({ token });
  } catch (err) {
    next(err);
  }
}

// Lets the frontend check "am I still logged in" without hitting a real resource.
async function me(req, res) {
  res.json({ username: req.admin.username, adminId: req.admin.adminId });
}

module.exports = { login, me };
