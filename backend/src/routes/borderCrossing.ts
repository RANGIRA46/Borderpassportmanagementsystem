import { Hono } from 'hono';
import { borderCrossingController } from '../controllers/borderCrossingController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  createBorderCrossingSchema,
  borderCrossingUpdateSchema,
} from '../models/schemas.js';

const borderCrossing = new Hono();

borderCrossing.use('*', authMiddleware);

borderCrossing.get('/', borderCrossingController.getAll);
borderCrossing.get('/stats', requireRole('admin', 'official'), borderCrossingController.getStats);
borderCrossing.get('/:id', borderCrossingController.getById);
borderCrossing.post('/', validate(createBorderCrossingSchema), borderCrossingController.create);
borderCrossing.patch(
  '/:id',
  requireRole('admin', 'official'),
  validate(borderCrossingUpdateSchema),
  borderCrossingController.update
);

export default borderCrossing;
