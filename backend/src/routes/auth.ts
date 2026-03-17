import { Hono } from 'hono';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../models/schemas.js';

const auth = new Hono();

auth.post('/register', validate(registerSchema), authController.register);
auth.post('/login', validate(loginSchema), authController.login);
auth.get('/profile', authMiddleware, authController.getProfile);
auth.patch('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile);

export default auth;
