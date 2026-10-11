import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { deepStrip } from '../utils/sanitize.js';

// Validates + sanitizes req.body. `partial` is used for PATCH-style updates.
export const validateBody = (schema, { partial = false } = {}) => (req, _res, next) => {
  const target = partial ? schema.partial() : schema;
  const result = target.safeParse(deepStrip(req.body ?? {}));
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return next(new ApiError(400, 'Validation failed', details));
  }
  req.body = result.data;
  next();
};

export const validateObjectId = (req, _res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(400, 'Invalid id'));
  next();
};
