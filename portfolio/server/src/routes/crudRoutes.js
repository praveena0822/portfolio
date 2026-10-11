import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody, validateObjectId } from '../middleware/validate.js';
import { crudController } from '../controllers/crudFactory.js';

// Public GET, admin-only writes.
export function crudRouter(Model, schema, options) {
  const router = Router();
  const c = crudController(Model, options);
  router.get('/', c.list);
  router.post('/', requireAdmin, validateBody(schema), c.create);
  router.put('/:id', requireAdmin, validateObjectId, validateBody(schema, { partial: true }), c.update);
  router.delete('/:id', requireAdmin, validateObjectId, c.remove);
  return router;
}
