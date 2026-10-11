import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true, maxlength: 80 },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
skillSchema.index({ category: 1, name: 1 }, { unique: true });

export const Skill = mongoose.model('Skill', skillSchema);
