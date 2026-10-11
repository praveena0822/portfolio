import rateLimit from 'express-rate-limit';

const json = (message) => (_req, res) => res.status(429).json({ message });

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: json('Too many messages sent. Please try again in an hour.'),
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: json('Too many login attempts. Please try again in 15 minutes.'),
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: json('Too many requests. Please slow down.'),
});
