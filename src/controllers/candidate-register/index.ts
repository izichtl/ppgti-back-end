// @ts-nocheck
import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { signToken } from '../../middlewares/auth/index';
import AppDataSource, { supabase } from '../../db';

export const candidateRegister = controllerWrapper(async (_req, _res) => {
  const { email, cpf, social_name } = _req.body;
  let token: string = '';
  console.log('body', _req.body);
  const { data: existingUser, error: fetchError } = await supabase
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
  if (fetchError) {
    console.log(fetchError, 'ff');
    return response.failure({
      message: 'Error on database',
      status: 404,
    });
  } else if (existingUser) {
    const quota = existingUser?.quotas?.name;
    existingUser.quota = quota;
    delete existingUser.quotas;

    token = await signToken(existingUser);

    response.success({
      message: 'User found',
      data: {
        token,
        islogin: true,
      },
      status: 201,
    });
  } else {
    const { data: newUser, error: insertError } = await supabase
      .from('candidates')
      .insert([
        {
          email: email,
          cpf: cpf,
          social_name: social_name,
        },
      ]);

    if (insertError) {
      const { code } = insertError;

      if (code === '23505') {
        return response.failure({
          message: '1Email or CPF already registered',
          code: insertError.code,
          status: 409,
        });
      } else {
        return response.failure({
          message: 'Error on database',
          status: 404,
        });
      }
    } else {
      console.log('Usuário inserido com sucesso:', newUser);
      token = await signToken(newUser);
      console.log(token);
      response.success({
        message: 'User created',
        data: {
          token,
          islogin: false,
        },
        status: 201,
      });
    }
  }
});
