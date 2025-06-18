import express from 'express';
import morganLogger from 'morgan';
import helmetSecurity from 'helmet';
import corsMiddleware from 'cors';
import cookieParserMiddleware from 'cookie-parser';
import path from 'node:path';
import responseMiddleware from './middlewares/response';

import { handleError, handleNotFound } from './middlewares/middlewares';

import dotenv from 'dotenv';
dotenv.config();

const expressApp = express();
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(morganLogger('dev'));
expressApp.use(helmetSecurity());
expressApp.use(corsMiddleware());
expressApp.use(express.json());
expressApp.use(cookieParserMiddleware());
expressApp.use(responseMiddleware);

// Define root route
expressApp.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Importing API routes
import apiRoutes from './routes';
import authRoutes from './routes/auth/index';
import candidateRoutes from './routes/candidate/index';
import fileManagerRoutes from './routes/file-manager/index';
import selectionProcessesRoutes from './routes/selection-processes/index';
import applicationsRoutes from './routes/applications/index';
import swaggerRouters from './swagger';

expressApp.use('/api', apiRoutes);
expressApp.use('/api', authRoutes);
expressApp.use('/api', candidateRoutes);
expressApp.use('/api', fileManagerRoutes);
expressApp.use('/api', selectionProcessesRoutes);
expressApp.use('/api', applicationsRoutes);
expressApp.use('/api', swaggerRouters);

// Use custom middlewares for handling 404 and errors
expressApp.use(handleNotFound);
expressApp.use(handleError);

export default expressApp;
