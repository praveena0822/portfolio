import { env, cloudinaryEnabled, smtpEnabled } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

async function start() {
  await connectDB();
  if (!cloudinaryEnabled) console.warn('Cloudinary is not configured: photo and resume uploads are disabled.');
  if (!smtpEnabled) console.warn('SMTP is not configured: contact messages are saved but no email is sent.');
  app.listen(env.PORT, () => console.log(`API listening on port ${env.PORT} (${env.NODE_ENV})`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
