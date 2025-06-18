import { ResponsePayload } from '../../middlewares/response';
import { supabase } from '../../db';


export const handlerCandidateFiles = async (
  cpf: string
): Promise<ResponsePayload | null> => {
  const { data, error } = await supabase
    .from('candidate_documents')
    .select('*')
    .eq('cpf', cpf)
    .maybeSingle();
  console.log('data', data, 'data', error);
  if (error !== null) {
    return { error: true, message: 'User Files not found', status: 404 };
  }
  if (data !== null) {
    return { error: false, message: 'User Fles Found', status: 200, data };
  }
  // se não existir linha para o usuário, cria uma nova linha
  if (data === null) {
    const { data: newData, error: newError } = await supabase
      .from('candidate_documents')
      .insert([{ cpf }]);
    console.log('newData', newData, 'newError', newError);
    if (newError !== null) {
      return { error: true, message: 'Erro on register', status: 500 };
    }
    if (newData !== null) {
      return {
        error: false,
        message: 'User Files Created',
        status: 200,
        data: newData,
      };
    }
  }
  return null;
};
