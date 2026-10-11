import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAdmin = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) throw new ApiError(401, 'Authentication required');

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    throw new ApiError(401, 'Session expired. Please sign in again.');
  }

  // Confirms the admin still exists, so deleting an admin revokes access immediately.
  const exists = await Admin.exists({ _id: payload.sub });
  if (!exists) throw new ApiError(401, 'Authentication required');

  req.admin = { id: payload.sub, email: payload.email };
  next();
});
