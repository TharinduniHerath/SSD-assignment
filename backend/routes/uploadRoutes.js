const express = require('express');
const path = require('path');
const fs = require('fs');
const { upload, allowedMimeTypes, maxFileSize } = require('../middleware/uploadMiddleware');

const router = express.Router();

function removeFileIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (_) {}
}

router.post('/image', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload validation failed' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

    // Post-upload validation (defense-in-depth)
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      removeFileIfExists(filePath);
      return res.status(400).json({ message: 'Invalid file type' });
    }

    if (req.file.size > maxFileSize) {
      removeFileIfExists(filePath);
      return res.status(400).json({ message: 'File too large' });
    }

    return res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  });
});

// Optional: retrieve file by filename if needed (restricted in real apps)
router.get('/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }
  return res.sendFile(filePath);
});

module.exports = router;
