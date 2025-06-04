import { ResponsePayload } from '../../middlewares/response';
import { supabase } from '../../db';
import { signToken } from '../../middlewares/auth';

export const verifyCommitteeExistence = async (
  email: string,
  matricula: string,
  cpf: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('committee_members')
    .select('*')
    .eq('cpf', cpf)
    .eq('email', email)
    .eq('if_registration', matricula)
    .maybeSingle();

  console.log(data, 'data');
  console.log(error, 'error');

  if (!data || error !== null) {
    return false;
  }

  return true;
};

export const handlerCommitteeRegister = async (
  email: string,
  matricula: string,
  name: string,
  cpf: string,
  password: string
): Promise<ResponsePayload | null> => {
  const { data, error } = await supabase
    .from('committee_members')
    .insert([
      {
        email: email,
        if_registration: matricula,
        name: name,
        cpf: cpf,
        password: password,
      },
    ])
    .select();

  if (error !== null) {
    const { code } = error;
    if (code === '23505') {
      return {
        error: true,
        message: 'Email, matricula or CPF already registered',
        status: 409,
      };
    } else {
      return {
        error: true,
        message: 'Error on database',
        status: 500,
      };
    }
  }

  if (data !== null) {
    const token = await signToken(data[0]);
    return {
      error: false,
      message: 'Committee user created',
      status: 201,
      data: {
        token,
        islogin: false,
      },
    };
  }

  return null;
};
