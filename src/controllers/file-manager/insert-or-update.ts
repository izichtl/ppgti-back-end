import { supabase } from '../../db';
export const updateCandidateDocument = async (
  file: Express.Multer.File,
  cpf: string,
  column: string,
  value: string
) => {
  // TODO precisa atualizar e tratar os erros
  const { data } = await supabase.storage
    .from('registration-pdf')
    .upload(value, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  await supabase
    .from('candidate_documents')
    // @ts-expect-error
    .upsert(
      {
        cpf: cpf,
        [column]: data!.path as unknown as string,
      },
      { onConflict: 'cpf', returning: 'representation' }
    );
  return;
};
