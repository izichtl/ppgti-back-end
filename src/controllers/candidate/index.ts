import { response, ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import { authGuard, getUserFromToken } from '../../middlewares/auth';

export const candidateData = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return response.failure(guardResponse);
  }
  const user = await getUserFromToken(token as string);

  const { cpf, email } = user as any;

  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('cpf', cpf)
    .eq('email', email)
    .single();

  if (error) {
    return response.failure({
      message: 'Erro ao buscar dados pessoais',
      status: 400,
    });
  }

  return response.success({
    message: 'Dados pessoais encontrados com sucesso',
    status: 200,
    data,
  });
});
