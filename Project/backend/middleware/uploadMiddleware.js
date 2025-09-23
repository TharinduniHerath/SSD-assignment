const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define allowed MIME types for images only
const allowedMimeTypes = [
  'image/jpeg',
  'image/png', 
  'image/webp'
];

// File name sanitization function
const sanitizeFileName = (fileName) => {
  // Remove or replace characters that are not alphanumeric, dots, underscores, or hyphens
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
    .replace(/^\.+|\.+$/g, ''); // Remove leading/trailing dots
};

// Generate safe filename with timestamp
const generateSafeFileName = (originalName) => {
  const timestamp = Date.now();
  const sanitizedName = sanitizeFileName(originalName);
  const extension = path.extname(sanitizedName);
  const baseName = path.basename(sanitizedName, extension);
  
  return `${baseName}_${timestamp}${extension}`;
};

// File filter for MIME type validation
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeFileName = generateSafeFileName(file.originalname);
    cb(null, safeFileName);
  }
});

// Configure multer with security settings
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file per request
  }
});

// Middleware for single file upload
const uploadSingle = upload.single('image');

// Middleware for multiple file upload (if needed)
const uploadMultiple = upload.array('images', 5); // Max 5 files

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File size exceeds 5MB limit' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files uploaded' 
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected file field' 
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' 
    });
  }
  
  next(error);
};

// Validation middleware for uploaded files
const validateUploadedFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Additional validation
  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds 5MB limit' });
  }

  // Check if file actually exists
  if (!fs.existsSync(req.file.path)) {
    return res.status(500).json({ error: 'File upload failed' });
  }

  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  validateUploadedFile,
  generateSafeFileName,
  sanitizeFileName,
  allowedMimeTypes
};
