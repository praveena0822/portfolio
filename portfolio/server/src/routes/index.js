import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody, validateObjectId } from '../middleware/validate.js';
import { contactLimiter, loginLimiter } from '../middleware/rateLimit.js';
import { uploadPhoto, uploadResume } from '../middleware/upload.js';
import { crudRouter } from './crudRoutes.js';
import * as schemas from '../utils/schemas.js';
import { Experience } from '../models/Experience.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Education } from '../models/Education.js';
import { Certification } from '../models/Certification.js';
import { login, me } from '../controllers/auth.controller.js';
import { getPublicProfile, getAdminProfile, updateProfile } from '../controllers/profile.controller.js';
import { submitMessage, listMessages, setRead, deleteMessage } from '../controllers/message.controller.js';
import { uploadPhotoHandler, uploadResumeHandler } from '../controllers/upload.controller.js';
import { getPortfolio } from '../controllers/portfolio.controller.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.get('/portfolio', getPortfolio);

// Auth
router.post('/auth/login', loginLimiter, validateBody(schemas.loginSchema), login);
router.get('/auth/me', requireAdmin, me);

// Profile
router.get('/profile', getPublicProfile);
router.get('/profile/admin', requireAdmin, getAdminProfile);
router.put('/profile', requireAdmin, validateBody(schemas.profileSchema), updateProfile);

// Content resources: public read, admin write
router.use('/experience', crudRouter(Experience, schemas.experienceSchema, { label: 'Experience' }));
router.use('/projects', crudRouter(Project, schemas.projectSchema, { label: 'Project' }));
router.use('/skills', crudRouter(Skill, schemas.skillSchema, { label: 'Skill' }));
router.use('/education', crudRouter(Education, schemas.educationSchema, { label: 'Education' }));
router.use('/certifications', crudRouter(Certification, schemas.certificationSchema, { label: 'Certification' }));

// Messages
router.post('/messages', contactLimiter, validateBody(schemas.contactSchema), submitMessage);
router.get('/messages', requireAdmin, listMessages);
router.patch('/messages/:id/read', requireAdmin, validateObjectId, setRead);
router.delete('/messages/:id', requireAdmin, validateObjectId, deleteMessage);

// Uploads (Cloudinary)
router.post('/uploads/photo', requireAdmin, uploadPhoto, uploadPhotoHandler);
router.post('/uploads/resume', requireAdmin, uploadResume, uploadResumeHandler);

export default router;
