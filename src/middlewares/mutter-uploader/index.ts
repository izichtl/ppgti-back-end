// @ts-nocheck
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

// Apenas PDFs
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos PDF são permitidos!'));
  }
};

export const uploaderMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('file');

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).send(err.message);
  } else if (err) {
    console.error('Unknown error:', err);
    return res.status(500).send('Internal server error.');
  }
  next();
};
