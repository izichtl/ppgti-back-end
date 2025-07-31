import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { sanitizeCPF } from '../../utils/string-format';
import { authGuard, getUserFromToken } from '../../middlewares/auth';
import { uploadCandidateProject } from './insert-or-update';

export const aplicationRegister = controllerWrapper(async (_req, _res) => {
    const token = _req.headers['authorization'];
    
    const guardResponse: ResponsePayload = authGuard(token as string);
    if (guardResponse.error) {
      return _res.response.failure(guardResponse);
    }
    const user = await getUserFromToken(token as string);
    const { cpf } = user as any;

    const { project_file_name } = _req.body

    const file = _req.file;
    const sanitizedCPF = sanitizeCPF(cpf);
    const fileName: string = sanitizedCPF + '/' + 'project_file' + project_file_name

    if (!file) {
      console.log('error file');
      return _res.response.failure({ message: 'No file uploaded', status: 400 });
    }

    try {
      await uploadCandidateProject(file, cpf, _req.body, fileName);
    } catch (e) {
      console.log(e);
      return _res.response.failure({ message: 'No file uploaded', status: 400 });
    }

    _res.response.success({
      message: 'File uploaded successfully',
      data: {
        filePath: `/registration-pdf/${fileName}`,
      },
      status: 200,
    })
  }
);
