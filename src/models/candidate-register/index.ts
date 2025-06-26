// @ts-nocheck
import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { signToken } from '../../middlewares/auth/index';
import AppDataSource, { supabase } from '../../db';
import { sanitizeCPF } from '../../utils/string-format';
import { verifyUserExistence } from '../../models/candidate-login';
import e from 'express';

export const handlerCadidateRegister = async (
  email: string,
  cpf: string,
  social_name: string
): Promise<CandidateLoginResponse>  => {
  const { data, error } = await supabase
    .from('candidates')
    .insert([
      {
        email: email,
        cpf: cpf,
        social_name: social_name,
        quota_id: 1, // default para sempre aparecer marcado
      },
    ])
    .select();

  if (error !== null) {
    const { code } = error;
    if (code === '23505') {
      return {
        error: true,
        message: 'Email or CPF already registered',
        status: 409,
        code: error.code,
      };
    } else {
      return {
        error: true,
        message: 'Error on database',
        status: 404,
      };
    }
  }
  if (data !== null) {
    const token = await signToken(data[0]);
    return {
      error: false,
      message: 'User created',
      status: 201,
      data: {
        token,
        islogin: false,
      },
    };
  }
};
