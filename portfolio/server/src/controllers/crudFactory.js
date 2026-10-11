import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Builds list/create/update/remove handlers for a simple Mongoose resource.
export function crudController(Model, { sort = { order: 1, createdAt: 1 }, label = 'Record' } = {}) {
  return {
    list: asyncHandler(async (_req, res) => {
      res.json(await Model.find().sort(sort).lean());
    }),
    create: asyncHandler(async (req, res) => {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    }),
    update: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) throw new ApiError(404, `${label} not found`);
      res.json(doc);
    }),
    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw new ApiError(404, `${label} not found`);
      res.json({ message: `${label} deleted` });
    }),
  };
}
