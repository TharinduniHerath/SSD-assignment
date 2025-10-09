const multer = require('multer');
const path = require('path');

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

function sanitizeFileName(fileName) {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+|\.+$/g, '');
}

function generateSafeFileName(originalName) {
  const timestamp = Date.now();
  const sanitizedName = sanitizeFileName(originalName);
  const ext = path.extname(sanitizedName);
  const base = path.basename(sanitizedName, ext);
  return `${base}_${timestamp}${ext}`;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, generateSafeFileName(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

const defaultMax = 5 * 1024 * 1024; // 5MB
const envMax = parseInt(process.env.MAX_FILE_SIZE, 10);
const maxFileSize = Number.isFinite(envMax) && envMax > 0 ? envMax : defaultMax;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 1
  }
});

module.exports = {
  upload,
  allowedMimeTypes,
  maxFileSize,
  sanitizeFileName,
  generateSafeFileName
};
