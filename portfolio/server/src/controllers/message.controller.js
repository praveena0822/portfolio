import { Message } from '../models/Message.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendContactNotification } from '../services/mailer.js';

export const submitMessage = asyncHandler(async (req, res) => {
  const { website, ...data } = req.body;
  // Honeypot: pretend success so bots learn nothing.
  if (website) return res.status(201).json({ message: 'Message sent. Thank you!' });

  const saved = await Message.create(data);
  try {
    const sent = await sendContactNotification(data);
    if (sent) await Message.updateOne({ _id: saved._id }, { emailNotified: true });
  } catch (err) {
    // The message is already stored, so a mail failure should not fail the request.
    console.error('Contact email failed:', err.message);
  }
  res.status(201).json({ message: 'Message sent. Thank you!' });
});

export const listMessages = asyncHandler(async (_req, res) => {
  res.json(await Message.find().sort({ createdAt: -1 }).lean());
});

export const setRead = asyncHandler(async (req, res) => {
  const doc = await Message.findByIdAndUpdate(req.params.id, { read: req.body.read !== false }, { new: true });
  if (!doc) throw new ApiError(404, 'Message not found');
  res.json(doc);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const doc = await Message.findByIdAndDelete(req.params.id);
  if (!doc) throw new ApiError(404, 'Message not found');
  res.json({ message: 'Message deleted' });
});
