import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, sparse: true },
    degree: { type: String, required: true, trim: true, maxlength: 160 },
    specialization: { type: String, trim: true, maxlength: 160, default: '' },
    institution: { type: String, trim: true, maxlength: 240, default: '' },
    university: { type: String, trim: true, maxlength: 240, default: '' },
    duration: { type: String, trim: true, maxlength: 80, default: '' },
    grade: { type: String, trim: true, maxlength: 60, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Education = mongoose.model('Education', educationSchema);
