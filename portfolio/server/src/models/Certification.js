import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, sparse: true },
    kind: { type: String, enum: ['certification', 'achievement', 'award', 'workshop'], default: 'certification' },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    issuer: { type: String, trim: true, maxlength: 200, default: '' },
    date: { type: String, trim: true, maxlength: 60, default: '' },
    description: { type: String, trim: true, maxlength: 600, default: '' },
    credentialUrl: { type: String, trim: true, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Certification = mongoose.model('Certification', certificationSchema);
