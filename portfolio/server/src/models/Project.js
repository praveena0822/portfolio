import mongoose from 'mongoose';

// Used for both research publications and software projects.
const projectSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, sparse: true },
    type: { type: String, enum: ['publication', 'project'], default: 'project' },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    summary: { type: String, trim: true, maxlength: 1200, default: '' },
    contribution: { type: String, trim: true, maxlength: 800, default: '' },
    venue: { type: String, trim: true, maxlength: 300, default: '' },
    year: { type: String, trim: true, maxlength: 20, default: '' },
    authors: { type: String, trim: true, maxlength: 400, default: '' },
    technologies: { type: [{ type: String, trim: true, maxlength: 60 }], default: [] },
    link: { type: String, trim: true, default: '' }, // paper / DOI / publisher page
    repoUrl: { type: String, trim: true, default: '' },
    liveUrl: { type: String, trim: true, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
