
import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { updateCandidateDocument } from './insert-or-update';
import { sanitizeCPF } from '../../utils/string-format';
import { authGuard, getUserFromToken } from '../../middlewares/auth';


export const fileUploader = controllerWrapper(
  async (_req, _res) => {
    const token = _req.headers['authorization'];
    const guardResponse: ResponsePayload = authGuard(token as string);
    if (guardResponse.error) {
      return _res.response.failure(guardResponse);
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
      return _res.response.failure({ message: 'No file uploaded', status: 400 });
    }

    try {
      await updateCandidateDocument(file, cpf, column, fileName);
    } catch (e) {
      console.log(e);
      return _res.response.failure({ message: 'No file uploaded', status: 400 });
    }
    
    _res.response.success({
      message: 'File uploaded successfully',
      data: {
        fileName: file.filename,
        filePath: `/registration-pdf/${fileName}`,
      },
      status: 200,
    })
  }
);
