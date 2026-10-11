import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { Admin } from '../src/models/Admin.js';

// Creates the admin account, or resets its password if the email already exists.
// There is intentionally no public registration endpoint.
async function main() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in server/.env first.');
  }
  await connectDB();
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  const existing = await Admin.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log(`Updated password for admin ${existing.email}`);
  } else {
    const admin = await Admin.create({ email: env.ADMIN_EMAIL, passwordHash });
    console.log(`Created admin ${admin.email}`);
  }
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
