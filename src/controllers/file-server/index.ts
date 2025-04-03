import { Request, Response } from 'express';
import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import path from 'path';

export const fileServer = controllerWrapper(
  async (_req: Request, res: Response) => {
    const filename = _req.params.filename;
    const filePath = path.join(process.cwd(), 'src', 'uploads', filename);
    res.sendFile(filePath, (err) => {
      if (err) {
        return response.failure({
          status: 404,
          error: true,
          message: 'File not found',
        });
      }
    });
  }
);
