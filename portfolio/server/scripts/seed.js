import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { Profile } from '../src/models/Profile.js';
import { Experience } from '../src/models/Experience.js';
import { Project } from '../src/models/Project.js';
import { Skill } from '../src/models/Skill.js';
import { Education } from '../src/models/Education.js';
import { Certification } from '../src/models/Certification.js';
import * as resume from '../data/resumeData.js';
import { sampleProjects, sampleCertifications } from '../data/sampleData.js';

// Usage:
//   npm run seed                    insert missing resume records (safe to re-run; never duplicates,
//                                   never overwrites edits made in /admin)
//   npm run seed -- --force         overwrite seeded records with the resume values
//   npm run seed -- --sample        also insert clearly-marked [SAMPLE] test records
//   npm run seed -- --remove-sample delete the [SAMPLE] records
const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const op = force ? '$set' : '$setOnInsert';

async function upsertByKey(Model, docs, filterFor = (d) => ({ key: d.key })) {
  if (!docs.length) return 0;
  const result = await Model.bulkWrite(
    docs.map((d) => ({
      updateOne: { filter: filterFor(d), update: { [op]: d }, upsert: true },
    }))
  );
  return result.upsertedCount;
}

async function main() {
  await connectDB();

  if (args.has('--remove-sample')) {
    const f = { key: /^sample:/ };
    const [p, c] = await Promise.all([Project.deleteMany(f), Certification.deleteMany(f)]);
    console.log(`Removed ${p.deletedCount + c.deletedCount} sample records.`);
    return;
  }

  const profileRes = await Profile.updateOne(
    { key: 'main' },
    { [op]: { ...resume.profile, key: 'main' } },
    { upsert: true }
  );
  const counts = {
    profile: profileRes.upsertedCount,
    experience: await upsertByKey(Experience, resume.experience),
    projects: await upsertByKey(Project, resume.projects),
    skills: await upsertByKey(Skill, resume.skills, (d) => ({ category: d.category, name: d.name })),
    education: await upsertByKey(Education, resume.education),
    certifications: await upsertByKey(Certification, resume.certifications),
  };

  if (args.has('--sample')) {
    counts.sampleProjects = await upsertByKey(Project, sampleProjects);
    counts.sampleCertifications = await upsertByKey(Certification, sampleCertifications);
    console.log('Sample records added. They will appear on the public site until you run --remove-sample.');
  }

  console.log(`Seed complete (${force ? 'force overwrite' : 'insert-only'}). New records created:`);
  console.table(counts);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
