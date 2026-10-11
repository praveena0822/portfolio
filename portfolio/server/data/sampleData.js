// TEST-ONLY records. They are NOT part of the resume and are never inserted unless you run:
//   npm run seed -- --sample
// Every record is keyed "sample:*" and titled "[SAMPLE]". Remove them with:
//   npm run seed -- --remove-sample
export const sampleProjects = [
  {
    key: 'sample:project-1',
    type: 'project',
    title: '[SAMPLE] Example project card',
    summary: 'Placeholder record for testing the card layout. Not a real project.',
    contribution: 'Placeholder contribution text.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    repoUrl: '',
    liveUrl: '',
    order: 900,
  },
];
export const sampleCertifications = [
  {
    key: 'sample:cert-1',
    kind: 'certification',
    title: '[SAMPLE] Example certificate',
    issuer: 'Example Issuer',
    date: '2024',
    order: 900,
  },
];
