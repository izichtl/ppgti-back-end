import { supabase } from '../../db';
import { signToken } from '../../middlewares/auth';

interface CommitteeLoginResponse {
  error: boolean;
  message: string;
  status: number;
  data?: {
    token: string;
    islogin: boolean;
  };
}

export const handlerCommitteeLogin = async (
  matricula: string,
  password: string
): Promise<CommitteeLoginResponse> => {
  console.log('@@@@SUA')
  const { data, error } = await supabase
    .from('committee_members')
    .select('*')
    .eq('if_registration', matricula)
    .eq('password', password)
    .maybeSingle();

  if (error !== null) {
    return {
      error: true,
      message: 'Error on database',
      status: 500,
    };
  }

  if (data !== null) {
    const token = await signToken(data);
    return {
      error: false,
      message: 'Committee member authenticated successfully',
      status: 200,
      data: {
        token,
        islogin: true,
      },
    };
  }

  return {
    error: true,
    message: 'Invalid credentials',
    status: 401,
  };
};
