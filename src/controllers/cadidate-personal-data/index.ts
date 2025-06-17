import { response, ResponsePayload } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { supabase } from '../../db';
import { authGuard, getUserFromToken } from '../../middlewares/auth';

// TODO fazer a verificação dos erros e ajustes
export const candidateUpdater = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  const guardResponse: ResponsePayload = authGuard(token as string);
  if (guardResponse.error) {
    return response.failure(guardResponse);
  }
  const user = await getUserFromToken(token as string);
  const { cpf, email } = user as any;

  const {
    name,
    social_name,
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
    education_level,
    graduation_course,
    graduation_year,
    graduation_institution,
    specialization_course,
    specialization_year,
    specialization_institution,
    lattes_link,
  } = _req.body;

  const { data: quotaData, error: quotaError } = await supabase
    .from('quotas')
    .select('id')
    .eq('name', quota)
    .maybeSingle();

  if (quotaError || !quotaData) {
    return response.failure({
      message: 'Tipo de cota inválido ou não encontrado',
      status: 400,
    });
  }

  const quota_id = quotaData.id;

  // Create update object with only present fields
  const updateData = Object.fromEntries(
    Object.entries({
      name,
      social_name,
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
      education_level,
      graduation_course,
      graduation_year,
      graduation_institution,
      specialization_course,
      specialization_year,
      specialization_institution,
      lattes_link,
    }).filter(([_, value]) => value !== undefined)
  );

  console.log('updateData', updateData);

  const { data, error: updateError } = await supabase
    .from('candidates')
    .update(updateData)
    .eq('cpf', cpf)
    .eq('email', email)
    .select();

  if (updateError || !data) {
    return response.failure({
      message: 'Erro ao atualizar dados pessoais',
      status: 400,
    });
  }

  return response.success({
    message: 'Dados pessoais atualizados com sucesso',
    status: 200,
  });
});
