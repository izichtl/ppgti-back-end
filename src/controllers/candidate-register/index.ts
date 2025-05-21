// @ts-nocheck
import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { signToken } from '../../middlewares/auth/index';
import AppDataSource, { supabase } from '../../db';

export const candidateRegister = controllerWrapper(async (_req, _res) => {
  const { email, cpf, name } = _req.body;
  let token: string = '';
  console.log(email, cpf, name);

  // Primeiro, tenta buscar o usuário
  const { data: existingUser, error: fetchError } = await supabase
    .from('candidates')
    .select('*')
    .eq('cpf', cpf)
    .eq('email', email)
    .maybeSingle();

  if (fetchError) {
    return response.failure({
      message: 'Error on database',
      status: 404,
    });
  } else if (existingUser) {
    console.log('Usuário já existe:', existingUser);
    token = await signToken(existingUser);
    console.log(token);
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
          social_name: name,
        },
      ]);

    if (insertError) {
      return response.failure({
        message: 'Error on database',
        status: 404,
      });
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
