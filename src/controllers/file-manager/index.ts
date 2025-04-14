import { Request, Response } from 'express';
import {
  response,
  // ResponsePayload
} from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { updateCandidateDocument } from './insert-or-update';
import { supabase } from '../../db';
import { sanitizeCPF } from '../../utils/string-format';

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

    const sanitizedCPF = sanitizeCPF(cpf);
    const fileName: string = sanitizedCPF + '/' + prefix + name;
    console.log(fileName);
    console.log(fileName);
    console.log(fileName);
    console.log(fileName);
    console.log(fileName);
    console.log('file', file);
    if (!file) {
      console.log('error file');
      return response.failure({ message: 'No file uploaded', status: 400 });
    }

    try {
      await supabase.storage
        .from('registration-pdf')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });
    } catch (e) {
      console.log(e);
    }

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

// export const uploadToSupabase = async (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).send('Nenhum arquivo enviado.');
//   }

//   const { cpf, prefix, name } = req.query;
//   const filename = `${cpf}${prefix}${name}.pdf`;

//   const { error } = await supabase.storage
//     .from('seu-bucket') // substitua pelo nome do bucket
//     .upload(filename, file.buffer, {
//       contentType: file.mimetype,
//       upsert: true, // opcional: sobrescreve se já existir
//     });

//   if (error) {
//     console.error('Erro no upload:', error);
//     return res.status(500).send('Erro ao fazer upload.');
//   }

//   res.status(200).send({ message: 'Upload realizado com sucesso!' });
// };
