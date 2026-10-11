import { Profile } from '../models/Profile.js';
import { Experience } from '../models/Experience.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Education } from '../models/Education.js';
import { Certification } from '../models/Certification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { toPublicProfile } from './profile.controller.js';

// One request that returns everything the public page needs.
export const getPortfolio = asyncHandler(async (_req, res) => {
  const sort = { order: 1, createdAt: 1 };
  const [profile, experience, projects, skills, education, certifications] = await Promise.all([
    Profile.findOne({ key: 'main' }).lean(),
    Experience.find().sort(sort).lean(),
    Project.find().sort(sort).lean(),
    Skill.find().sort(sort).lean(),
    Education.find().sort(sort).lean(),
    Certification.find().sort(sort).lean(),
  ]);
  res.json({ profile: toPublicProfile(profile), experience, projects, skills, education, certifications });
});
