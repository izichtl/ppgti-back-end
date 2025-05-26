import { ResponsePayload } from '../../middlewares/response';
import { supabase } from '../../db';
import { signToken } from '../../middlewares/auth';

export const verifyUserExistence = async (
  email: string,
  cpf: string
): Promise<ResponsePayload | null> => {
  const { data, error } = await supabase
    .from('candidates')
    .select(
      `
        *,
          quotas (
          name
        )
    `
    )
    .eq('cpf', cpf)
    .eq('email', email)
    .maybeSingle();

  if (error !== null) {
    return { error: true, message: 'Error on database', status: 404 };
  }

  if (data !== null) {
    const quota = data?.quotas?.name;
    data.quota = quota;
    delete data.quotas;
    console.log('data-login-token', data);
    const token = await signToken(data);
    return {
      error: false,
      message: 'User found',
      status: 200,
      data: {
        token,
        islogin: true,
      },
    };
  }
  return null;
};

export const getQuotaId = async (quota: string): Promise<number | boolean> => {
  const { data: quotaData, error: quotaError } = await supabase
    .from('quotas')
    .select('id')
    .eq('name', quota)
    .maybeSingle();
  if (quotaError || !quotaData) {
    return true;
  } else {
    return quotaData.id;
  }
};
