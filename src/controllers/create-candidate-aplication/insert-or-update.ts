import { supabase } from '../../db';
export const uploadCandidateProject = async (
  file: Express.Multer.File,
  cpf: string,
  formData: any,
  value: string
) => {
  // TODO precisa atualizar e tratar os erros
  const { data } = await supabase.storage
    .from('registration-pdf')
    .upload(value, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  const { data: candidateData, error: candidateError } = await supabase
    .from('candidates')
    .select('id')
    .eq('cpf', cpf)
    .single();

  if (candidateError || !candidateData) {
    throw new Error('Candidato não encontrado com o CPF fornecido.');
  }

  const candidate_id = candidateData.id;

  const applicationData = {
    candidate_id,
    process_id: formData.process_id,
    line_id: formData.research_line_id,
    topic_id: formData.research_topic_id,
    project_title: formData.project_title,
    project_path: data!.path
  };

  const { data: inserted, error: insertError } = await supabase
    .from('applications')
    .insert(applicationData)
    .select();

  if (insertError) {
    console.error('Erro ao inserir candidatura:', insertError.message);
  } else {
    console.log('Candidatura inserida com sucesso:', inserted);
  }

  return;
};
