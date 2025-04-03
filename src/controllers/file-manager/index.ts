import { Request, Response } from 'express';
import {
  response,
  // ResponsePayload
} from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { updateCandidateDocument } from './insert-or-update';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const fileUploader = controllerWrapper(
  // @ts-expect-error
  async (_req: MulterRequest, res: Response) => {
    const name = _req.query.name as string;
    const prefix = _req.query.prefix as string;
    const column = _req.query.column as string;
    const cpf = _req.query.cpf as string;
    const file = _req.file;

    if (!file) {
      return response.failure({ message: 'No file uploaded', status: 400 });
    }

    const fileName: string = cpf + prefix + name;
    try {
      await updateCandidateDocument(cpf, column, fileName);
    } catch (e) {
      console.log(e);
      return response.failure({ message: 'No file uploaded', status: 400 });
    }

    return res.status(200).json(
      response.success({
        message: 'File uploaded successfully',
        data: {
          fileName: file.filename,
          filePath: `/uploads/${file.filename}`,
        },
        status: 200,
      })
    );
  }
);
