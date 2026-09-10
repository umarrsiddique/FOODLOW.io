const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRepository = require('../repositories/adminRepository');

// New - didn't exist in the Java version. Handles admin login + auto-seeding.

/**
 * Runs once when the server starts. If no admin exists yet, creates one
 * from ADMIN_USERNAME / ADMIN_PASSWORD in .env. No public signup route exists.
 */
async function seedAdminIfNeeded() {
  const existingCount = await adminRepository.count();
  if (existingCount > 0) return;

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await adminRepository.create({
    username: process.env.ADMIN_USERNAME,
    passwordHash,
  });
  console.log(`✅ Seeded initial admin account: ${process.env.ADMIN_USERNAME}`);
}

/**
 * Validates credentials and returns a signed JWT, or null if invalid.
 */
async function login(username, password) {
  const admin = await adminRepository.findByUsername(username);
  if (!admin) return null;

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) return null;

  const token = jwt.sign(
    { adminId: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  return token;
}

module.exports = { seedAdminIfNeeded, login };
