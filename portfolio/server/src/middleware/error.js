import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const notFound = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// Central error handler. Never leaks stack traces or internals in production.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  let status = err.status || 500;
  let message = err.expose ? err.message : 'Something went wrong on the server.';
  let details = err.details;

  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large.' : 'Invalid file upload.';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.code === 11000) {
    status = 409;
    message = 'A record with these values already exists.';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body is too large.';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON body.';
  } else if (err.message === 'Not allowed by CORS') {
    status = 403;
    message = 'Origin not allowed.';
  }

  if (status >= 500) console.error(`[${req.method} ${req.originalUrl}]`, err);

  const body = { message };
  if (details) body.details = details;
  if (env.NODE_ENV !== 'production' && status >= 500) body.debug = err.message;
  res.status(status).json(body);
};
