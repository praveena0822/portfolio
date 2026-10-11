import cloudinary from '../config/cloudinary.js';
import { cloudinaryEnabled } from '../config/env.js';
import { Profile } from '../models/Profile.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hasValidSignature } from '../middleware/upload.js';

function streamUpload(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => (err ? reject(err) : resolve(result)));
    stream.end(buffer);
  });
}

function requireFile(req, kind) {
  if (!cloudinaryEnabled) {
    throw new ApiError(503, 'File uploads are not configured. Add the Cloudinary variables to server/.env.');
  }
  if (!req.file) throw new ApiError(400, 'No file received.');
  if (!hasValidSignature(req.file.buffer, kind)) throw new ApiError(400, 'File content does not match its type.');
}

async function removeOld(publicId, resourceType) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn('Could not delete old Cloudinary asset:', err.message);
  }
}

export const uploadPhotoHandler = asyncHandler(async (req, res) => {
  requireFile(req, 'image');
  const profile = await Profile.findOne({ key: 'main' }).select('+photoPublicId');
  if (!profile) throw new ApiError(404, 'Create the profile first (run the seed script).');

  const result = await streamUpload(req.file.buffer, {
    folder: 'portfolio/photo',
    resource_type: 'image',
    transformation: [{ width: 800, height: 800, crop: 'fill', gravity: 'face' }],
  });
  await removeOld(profile.photoPublicId, 'image');
  profile.photoUrl = result.secure_url;
  profile.photoPublicId = result.public_id;
  await profile.save();
  res.json({ photoUrl: profile.photoUrl });
});

export const uploadResumeHandler = asyncHandler(async (req, res) => {
  requireFile(req, 'pdf');
  const profile = await Profile.findOne({ key: 'main' }).select('+resumePublicId');
  if (!profile) throw new ApiError(404, 'Create the profile first (run the seed script).');

  const result = await streamUpload(req.file.buffer, {
    folder: 'portfolio/resume',
    resource_type: 'raw',
    public_id: `resume-${Date.now()}.pdf`,
  });
  await removeOld(profile.resumePublicId, 'raw');
  profile.resumeUrl = result.secure_url;
  profile.resumePublicId = result.public_id;
  await profile.save();
  res.json({ resumeUrl: profile.resumeUrl });
});
