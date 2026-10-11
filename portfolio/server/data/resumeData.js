// Real portfolio content taken from the resume (Dr_P_N_Nesarajan_IT_Professional_Resume.docx).
// Anything not in the resume is left empty and can be filled in from /admin.
// Each record has a stable `key` so the seed script can upsert without creating duplicates.

export const profile = {
  fullName: 'Dr. P. N. Nesarajan',
  headline: 'Associate Professor of Computer Science | Researcher in Agentic AI, Web & Network Optimization',
  summary:
    'Associate Professor at Nandha Arts & Science College, Erode, with 26 years of teaching experience in Computer Science and IT.',
  about:
    "I'm an Associate Professor of Computer Science at Nandha Arts & Science College, Erode, with 26 years of teaching experience in programming, data structures, database management, Java, Linux and visual programming. I hold a Ph.D. in Computer Science from Bharathiar University and have led a department as Head. My research covers web and network optimization, particle swarm optimization, privacy-preserving network authentication and, more recently, the effect of Agentic AI on software development productivity, quality and security. I enjoy mentoring students and connecting classroom teaching with practical software and web technologies.",
  location: 'Erode, Tamil Nadu, India',
  email: 'pnnesarajan@yahoo.com',
  phone: '+91 9976181075',
  showPhone: false, // Set to true in /admin to display the phone number publicly.
  social: { linkedin: '', github: '', scholar: '', orcid: '', website: '' }, // TODO: add from /admin
};

export const experience = [
  {
    key: 'exp-nandha',
    role: 'Associate Professor',
    organization: 'Nandha Arts & Science College',
    location: 'Erode, Tamil Nadu',
    duration: 'July 2007 – Present',
    current: true,
    order: 1,
    bullets: [
      'Teach C, C++, Data Structures, Database Management Systems, Computer Graphics, Java Programming, Digital, Visual Programming, Linux and MS Office.',
      'Provide academic mentoring and handle Computer Science and IT-related academic responsibilities.',
      'Carry out research and publication work in computer science, optimization, networking, web technologies and emerging AI.',
    ],
  },
  {
    key: 'exp-sms',
    role: 'Lecturer & Head',
    organization: 'S.M.S. College of Arts & Science',
    location: 'Coimbatore, Tamil Nadu',
    duration: 'July 2003 – May 2007',
    current: false,
    order: 2,
    bullets: [
      'Led the Computer Science department as Head.',
      'Taught Computer Science courses and handled departmental academic responsibilities.',
    ],
  },
  {
    key: 'exp-amman',
    role: 'Lecturer',
    organization: 'Sri Amman Arts & Science College',
    location: 'Erode, Tamil Nadu',
    duration: 'November 2000 – October 2002',
    current: false,
    order: 3,
    bullets: ['Handled Computer Science teaching and academic responsibilities.'],
  },
];

const PSO = 'P. N. Nesarajan, et al.';
export const projects = [
  {
    key: 'pub-2026-agentic-ai',
    type: 'publication',
    title:
      'From Code Generation to Code Orchestration: Evaluating the Impact of Agentic AI on Software Development Productivity, Quality and Security',
    authors: 'Dr. P. N. Nesarajan; P. Thenmozhi; Shenbaga Priya A.; Dr. V. C. Srinivasan',
    venue: 'International Journal of Innovative Science and Research Technology (IJISRT), Vol. 11, Issue 8, pp. 1826–1834',
    year: '2026',
    technologies: ['Agentic AI', 'Software Development'],
    link: 'https://doi.org/10.38124/ijisrt/26aug916',
    order: 1,
  },
  {
    key: 'pub-2016-web-opt-epso',
    type: 'publication',
    title: 'A Novel Web Optimization Technique using Enhanced Particle Swarm Optimization',
    authors: PSO,
    venue:
      'International Journal of Computer Applications, National Conference on Research Issues in Image Analysis and Mining Intelligence (NCRIIAMI-2015), pp. 25–32',
    year: '2016',
    technologies: ['Particle Swarm Optimization', 'Web Optimization'],
    order: 2,
  },
  {
    key: 'pub-2016-quantum-pso',
    type: 'publication',
    title: 'Network and Web Optimization Techniques using Quantum Inspired Particle Swarm Intelligence',
    authors: PSO,
    venue: 'International Journal of Software Engineering and Technology, Vol. 8, No. 8',
    year: '2016',
    technologies: ['Particle Swarm Optimization', 'Network Optimization'],
    order: 3,
  },
  {
    key: 'pub-2016-survey',
    type: 'publication',
    title: 'A Survey on Network and Web Optimization Techniques',
    authors: PSO,
    venue: 'International Conference on Trending Researchers in Engineering, Science and Technology',
    year: '2016',
    technologies: ['Network Optimization', 'Web Optimization'],
    order: 4,
  },
  {
    key: 'pub-2016-improved-pso',
    type: 'publication',
    title: 'Improved Particle Swarm Optimization for Network and Web Optimization Techniques',
    authors: PSO,
    venue: 'Technology Review, Vol. 38, No. 2',
    year: '2016',
    technologies: ['Particle Swarm Optimization', 'Network Optimization'],
    order: 5,
  },
  {
    key: 'pub-2015-auth-file-sharing',
    type: 'publication',
    title: 'Privacy-Preserving Network Authentication Infs File Sharing System',
    authors: PSO,
    venue: 'International Conference on "Innovation in the field of Social Science" (INCIRII-TFOSS-2K15), 21 July 2015, ISBN 978-93-80506-12-8',
    year: '2015',
    technologies: ['Network Security', 'Privacy', 'File Sharing'],
    order: 6,
  },
  {
    key: 'pub-2016-mesh',
    type: 'publication',
    title: 'Multi-hop Independent Mobile Mesh Networks',
    authors: PSO,
    venue: 'International Journal of Innovative Research in Computer Science and Engineering, Vol. 2, Issue 6, pp. 7–12',
    year: '2016',
    technologies: ['Mobile Mesh Networks', 'Networking'],
    order: 7,
  },
  {
    key: 'pub-2016-search-protection',
    type: 'publication',
    title: 'Personalized Web Search Protection using Greedy Algorithm',
    authors: PSO,
    venue: 'International Journal of Research in Computing Science, Engineering & Technology, Vol. 1, Issue 2, pp. 1–10',
    year: '2016',
    technologies: ['Web Search', 'Privacy', 'Greedy Algorithm'],
    order: 8,
  },
];

const skill = (category, names) => names.map((name, i) => ({ category, name, order: i }));
export const skills = [
  ...skill('Operating Systems', ['Windows', 'Linux', 'Red Hat Linux']),
  ...skill('Programming Languages', ['COBOL', 'C', 'C++', 'Java', 'HTML']),
  ...skill('Scripting & Web', ['JavaScript', 'VBScript', 'ASP']),
  ...skill('Databases', ['MS Access', 'MySQL']),
  ...skill('Research Areas', [
    'Agentic AI',
    'Particle Swarm Optimization',
    'Web & Network Optimization',
    'Privacy-Preserving Authentication',
    'Personalized Web Search',
    'Mobile Mesh Networks',
  ]),
  ...skill('Academic & Professional', [
    'IT & Computer Science Education',
    'Academic Leadership & Mentoring',
    'Research & Technical Writing',
    'MS Office & Computer Applications',
  ]),
];

export const education = [
  { key: 'edu-phd', degree: 'Ph.D.', specialization: 'Computer Science', institution: '', university: 'Bharathiar University', duration: '', grade: '', order: 1 },
  { key: 'edu-mphil', degree: 'M.Phil.', specialization: 'Computer Science', institution: '', university: 'Bharathidasan University', duration: '2002 – 2003', grade: '', order: 2 },
  { key: 'edu-msc', degree: 'M.Sc.', specialization: 'Computer Science', institution: 'Kandasamy Kandar College, Vellur (Namakkal)', university: 'University of Madras', duration: '1997 – 1999', grade: '', order: 3 },
  { key: 'edu-bsc', degree: 'B.Sc.', specialization: 'Computer Science', institution: 'Sengunthar Arts & Science College, Tiruchengode', university: 'University of Madras', duration: '1994 – 1997', grade: '', order: 4 },
];

export const certifications = [
  {
    key: 'cert-rhce',
    kind: 'certification',
    title: 'Red Hat Certified Engineer (RHCE), RHEL V.4 course completion',
    issuer: 'Red Hat',
    date: '',
    description: '',
    credentialUrl: '',
    order: 1,
  },
  {
    key: 'ach-teaching',
    kind: 'achievement',
    title: '26 years of teaching experience in Computer Science and IT',
    issuer: '',
    date: '2000 – Present',
    description: '',
    credentialUrl: '',
    order: 2,
  },
  {
    key: 'ach-head',
    kind: 'achievement',
    title: 'Head of Department, Computer Science',
    issuer: 'S.M.S. College of Arts & Science, Coimbatore',
    date: '2003 – 2007',
    description: '',
    credentialUrl: '',
    order: 3,
  },
];
