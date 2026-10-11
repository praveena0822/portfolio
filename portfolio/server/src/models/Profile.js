import mongoose from 'mongoose';

// Singleton document: there is exactly one profile, identified by key "main".
const profileSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true, immutable: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    headline: { type: String, trim: true, maxlength: 220, default: '' },
    summary: { type: String, trim: true, maxlength: 600, default: '' },
    about: { type: String, trim: true, maxlength: 3000, default: '' },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    email: { type: String, trim: true, lowercase: true, maxlength: 160, default: '' },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    showPhone: { type: Boolean, default: false },
    photoUrl: { type: String, default: '' },
    photoPublicId: { type: String, default: '', select: false },
    resumeUrl: { type: String, default: '' },
    resumePublicId: { type: String, default: '', select: false },
    social: {
      linkedin: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
      scholar: { type: String, trim: true, default: '' },
      orcid: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);
