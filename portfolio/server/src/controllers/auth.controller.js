import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Used so a missing account takes about as long as a wrong password (avoids user enumeration by timing).
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  const ok = await bcrypt.compare(password, admin ? admin.passwordHash : DUMMY_HASH);
  if (!admin || !ok) throw new ApiError(401, 'Invalid email or password');

  const token = jwt.sign({ email: admin.email }, env.JWT_SECRET, {
    subject: String(admin._id),
    expiresIn: env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
  res.json({ token, admin: { id: admin._id, email: admin.email } });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ admin: req.admin });
});
