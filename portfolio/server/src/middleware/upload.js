import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const storage = multer.memoryStorage();

const make = (types, maxMb) =>
  multer({
    storage,
    limits: { fileSize: maxMb * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) =>
      types.includes(file.mimetype) ? cb(null, true) : cb(new ApiError(400, 'Unsupported file type.')),
  }).single('file');

export const uploadPhoto = make(IMAGE_TYPES, 3);
export const uploadResume = make(['application/pdf'], 5);

// Verifies the real file signature, because the client-supplied mimetype can be spoofed.
export function hasValidSignature(buffer, kind) {
  if (!buffer || buffer.length < 12) return false;
  const startsWith = (...bytes) => bytes.every((b, i) => buffer[i] === b);
  if (kind === 'pdf') return startsWith(0x25, 0x50, 0x44, 0x46); // %PDF
  return (
    startsWith(0xff, 0xd8, 0xff) || // JPEG
    startsWith(0x89, 0x50, 0x4e, 0x47) || // PNG
    (startsWith(0x52, 0x49, 0x46, 0x46) && buffer.toString('ascii', 8, 12) === 'WEBP') // WEBP
  );
}
