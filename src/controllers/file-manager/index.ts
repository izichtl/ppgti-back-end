import { Request, Response } from 'express';
import { response, ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { updateCandidateDocument } from './insert-or-update';
import { sanitizeCPF } from '../../utils/string-format';
import { authGuard, getUserFromToken } from '../../middlewares/auth';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const fileUploader = controllerWrapper(
  // @ts-expect-error
  async (_req: MulterRequest, res: Response) => {
    const token = _req.headers['authorization'];
    const guardResponse: ResponsePayload = authGuard(token as string);
    if (guardResponse.error) {
      return response.failure(guardResponse);
    }
    const user = await getUserFromToken(token as string);
    const { cpf } = user as any;

    const name = _req.query.name as string;
    const column = _req.query.column as string;
    const file = _req.file;
    const sanitizedCPF = sanitizeCPF(cpf);
    const fileName: string = sanitizedCPF + '/' + column + '_' + name;

    if (!file) {
      console.log('error file');
      return response.failure({ message: 'No file uploaded', status: 400 });
    }

    try {
      await updateCandidateDocument(file, cpf, column, fileName);
    } catch (e) {
      console.log(e);
      return response.failure({ message: 'No file uploaded', status: 400 });
    }

    return res.status(200).json(
      response.success({
        message: 'File uploaded successfully',
        data: {
          fileName: file.filename,
          filePath: `/registration-pdf/${fileName}`,
        },
        status: 200,
      })
    );
  }
);
