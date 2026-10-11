import { Profile } from '../models/Profile.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Public view hides the phone number unless the owner opted in.
export function toPublicProfile(doc) {
  if (!doc) return null;
  const p = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  if (!p.showPhone) p.phone = '';
  delete p.showPhone;
  delete p.photoPublicId;
  delete p.resumePublicId;
  return p;
}

export const getPublicProfile = asyncHandler(async (_req, res) => {
  const profile = await Profile.findOne({ key: 'main' }).lean();
  if (!profile) throw new ApiError(404, 'Profile has not been set up yet. Run the seed script.');
  res.json(toPublicProfile(profile));
});

export const getAdminProfile = asyncHandler(async (_req, res) => {
  const profile = await Profile.findOne({ key: 'main' });
  if (!profile) throw new ApiError(404, 'Profile has not been set up yet. Run the seed script.');
  res.json(profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { key: 'main' },
    { $set: req.body, $setOnInsert: { key: 'main' } },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(profile);
});
