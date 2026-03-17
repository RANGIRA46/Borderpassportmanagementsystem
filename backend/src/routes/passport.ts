import { Hono } from 'hono';
import { passportController } from '../controllers/passportController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  createPassportSchema,
  updatePassportSchema,
} from '../models/schemas.js';

const passport = new Hono();

passport.use('*', authMiddleware);

passport.get('/', passportController.getAll);
passport.get('/:id', passportController.getById);
passport.post('/', validate(createPassportSchema), passportController.create);
passport.patch('/:id', validate(updatePassportSchema), passportController.update);
passport.delete('/:id', passportController.delete);

export default passport;
