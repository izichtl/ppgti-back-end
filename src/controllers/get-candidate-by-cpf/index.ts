import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import { authGuard, getUserFromToken } from '../../middlewares/auth';
import { validateRequiredFields } from '../../utils/user-data-is-valid';

export const getCadidateByCPF = controllerWrapper(async (_req, _res) => {
  console.log('getCadidateByCPF', '@@@@@@');
  const token = _req.headers['authorization'];
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return _res.response.failure(guardResponse);
  }
  const user = await getUserFromToken(token as string);
  const { cpf } = user as any;

  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('cpf', cpf)
    .maybeSingle();

  if (error !== null) {
    _res.response.failure({
      message: 'Falha ao validar usuário',
      status: 500,
    });
  }

  console.log(data);
  const isValid = validateRequiredFields(data);
  console.log(isValid);
  return _res.response.success({
    message: 'Usuário validado',
    status: 200,
    data: isValid,
  });
});
