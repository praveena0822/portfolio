import { z } from 'zod';

// Only allow http(s) links so stored URLs can never be javascript: or data: URIs.
const httpUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => /^https?:\/\/[^\s]+$/i.test(v), 'Must be a valid http(s) URL');
export const urlOrEmpty = z.union([z.literal(''), httpUrl]).default('');

const text = (max) => z.string().trim().max(max);
const optText = (max) => z.string().trim().max(max).default('');
const order = z.coerce.number().int().min(0).max(10000).default(0);

export const experienceSchema = z.object({
  role: text(160).min(1, 'Role is required'),
  organization: text(200).min(1, 'Organization is required'),
  location: optText(120),
  duration: text(80).min(1, 'Duration is required'),
  current: z.boolean().default(false),
  bullets: z.array(text(400).min(1)).max(8).default([]),
  order,
});

export const projectSchema = z.object({
  type: z.enum(['publication', 'project']).default('project'),
  title: text(300).min(1, 'Title is required'),
  summary: optText(1200),
  contribution: optText(800),
  venue: optText(300),
  year: optText(20),
  authors: optText(400),
  technologies: z.array(text(60).min(1)).max(20).default([]),
  link: urlOrEmpty,
  repoUrl: urlOrEmpty,
  liveUrl: urlOrEmpty,
  order,
});

export const skillSchema = z.object({
  category: text(80).min(1, 'Category is required'),
  name: text(80).min(1, 'Name is required'),
  order,
});

export const educationSchema = z.object({
  degree: text(160).min(1, 'Degree is required'),
  specialization: optText(160),
  institution: optText(240),
  university: optText(240),
  duration: optText(80),
  grade: optText(60),
  order,
});

export const certificationSchema = z.object({
  kind: z.enum(['certification', 'achievement', 'award', 'workshop']).default('certification'),
  title: text(200).min(1, 'Title is required'),
  issuer: optText(200),
  date: optText(60),
  description: optText(600),
  credentialUrl: urlOrEmpty,
  order,
});

export const profileSchema = z.object({
  fullName: text(120).min(1, 'Full name is required'),
  headline: optText(220),
  summary: optText(600),
  about: optText(3000),
  location: optText(120),
  email: z.union([z.literal(''), z.string().trim().email().max(160)]).default(''),
  phone: optText(40),
  showPhone: z.boolean().default(false),
  social: z
    .object({
      linkedin: urlOrEmpty,
      github: urlOrEmpty,
      scholar: urlOrEmpty,
      orcid: urlOrEmpty,
      website: urlOrEmpty,
    })
    .default({}),
});

export const contactSchema = z.object({
  name: text(120).min(2, 'Please enter your name'),
  email: z.string().trim().email('Please enter a valid email').max(160),
  subject: text(200).min(3, 'Please enter a subject'),
  message: text(5000).min(10, 'Message must be at least 10 characters'),
  website: z.string().max(200).optional(), // honeypot: real users never fill this
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(200),
});
