// @ts-nocheck
import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { Request } from 'express';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Storage configuration
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    console.log(req.data, 'corpo1');
    console.log(req.query, 'corpo1');
    // console.log('Destination function triggered.');
    // console.log('File info:', file);

    try {
      cb(null, 'src/uploads/');
    } catch (error) {
      console.error('Error in destination:', error);
      cb(error);
    }
  },

  filename: (req: Request, file, cb) => {
    console.log(req.query, 'corpo');
    // console.log('Filename function triggered.');
    // console.log('Original file name:', file.originalname);

    try {
      const name = req.query.name;
      const prefix = req.query.prefix;
      const column = req.query.column;
      const cpf = req.query.cpf;
      const filename = cpf + prefix + name;
      console.log(filename, '@@@@@@@@');
      cb(null, filename);
    } catch (error) {
      console.error('Error in filename:', error);
      cb(error);
    }
  },
});

// File filter configuration
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  try {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos!'));
    }
  } catch (error) {
    console.error('Error in fileFilter:', error);
    cb(error);
  }
};

// Middleware setup with error handling
export const uploaderMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('file');

// Error handling middleware for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors (e.g., file size exceeded)
    console.error('Multer error:', err);
    return res.status(400).send(err.message);
  } else if (err) {
    // Handle generic errors
    console.error('Unknown error:', err);
    return res.status(500).send('Internal server error.');
  }
  next();
};
