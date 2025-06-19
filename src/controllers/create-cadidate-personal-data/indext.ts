import { ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import { authGuard, getUserFromToken } from '../../middlewares/auth';

// TODO fazer a verificação dos erros e ajustes
export const candidateUpdater = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return _res.response.failure(guardResponse);
  }
  const user = await getUserFromToken(token as string);
  const { cpf, email } = user as any;

  let {
    name,
    sex,
    registration_,
    registration_state,
    registration_place,
    address,
    address_number,
    address_complement,
    address_neighborhood,
    address_city,
    address_state,
    address_zipcode,
    cell_phone,
    phone,
    other_email,
    quota,
  } = _req.body;

  const { data: quotaData, error: quotaError } = await supabase
    .from('quotas')
    .select('id')
    .eq('name', quota)
    .maybeSingle();

  if (quotaError || !quotaData) {
    return _res.response.failure({
      message: 'Tipo de cota inválido ou não encontrado',
      status: 400,
    });
  }

  const quota_id = quotaData.id;

  const { data, error: updateError } = await supabase
    .from('candidates')
    .update({
      name,
      sex,
      registration_,
      registration_state,
      registration_place,
      address,
      address_number,
      address_complement,
      address_neighborhood,
      address_city,
      address_state,
      address_zipcode,
      cell_phone,
      phone,
      other_email,
      quota_id,
    })
    .eq('cpf', cpf)
    .eq('email', email);

  if (updateError) {
    return _res.response.failure({
      message: 'Erro ao atualizar dados pessoais',
      status: 400,
    });
  }

  return _res.response.success({
    message: 'Dados pessoais atualizados com sucesso',
    status: 200,
    data: data
  });
});
