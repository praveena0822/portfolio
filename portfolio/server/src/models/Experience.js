import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, sparse: true },
    role: { type: String, required: true, trim: true, maxlength: 160 },
    organization: { type: String, required: true, trim: true, maxlength: 200 },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    duration: { type: String, required: true, trim: true, maxlength: 80 },
    current: { type: Boolean, default: false },
    bullets: { type: [{ type: String, trim: true, maxlength: 400 }], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Experience = mongoose.model('Experience', experienceSchema);
