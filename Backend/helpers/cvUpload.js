const multer = require('multer');
const path = require('path');

// Configure storage for CV files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/cv');
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId_timestamp.extension
    const userId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `cv_${userId}_${timestamp}${ext}`;
    cb(null, filename);
  }
});

// File filter - only allow PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

// Create multer upload instance with 2MB limit
const cvUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB in bytes
  }
});

// Single file upload for CV
const uploadCV = cvUpload.single('cv');

// Wrapper to handle multer errors
const handleCVUpload = (req, res, next) => {
  uploadCV(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 2MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      // Other errors
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    // No error - continue
    next();
  });
};

module.exports = {
  uploadCV,
  handleCVUpload
};

