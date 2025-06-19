import { controllerWrapper } from '../../lib/controllerWrapper';
import { sanitizeCPF } from '../../utils/string-format';
import {
  verifyCommitteeExistence,
  handlerCommitteeRegister,
} from '../../models/committee-register';
import { handlerCommitteeLogin } from '../../models/committee-login';
import { verifyUserExistence } from '../../models/candidate-login';

// TODO SEPARAR EM CONTROLER DIFERENTES
export type CommitteeRegisterProps = {
  email: string;
  matricula: string;
  name: string;
  authorizationCode: string;
  cpf: string;
  password: string;
};

export type CommitteeLoginProps = {
  matricula: string;
  password: string;
};

export const candidateLogin = controllerWrapper(async (_req, _res) => {
  const { email, cpf } = _req.body;

  const { data, error } = await verifyUserExistence(email, cpf);

  if (error || !data) {
    return _res.response.failure({
      message: 'User not found',
      status: 404,
    });
  }

  const { token } = data;

  _res.response.success({
    status: 200,
    data: token,
  });
});

export const committeeLogin = controllerWrapper(async (_req, _res) => {
  const { matricula, password } = _req.body;
  const { data, error } = await handlerCommitteeLogin(matricula, password);

  if (error || !data) {
    return _res.response.failure({
      message: 'Committee user not found or invalid credentials',
      status: 404,
    });
  }

  const { token } = data;

  _res.response.success({
    status: 200,
    data: token,
  });
});

export const committeeRegister = controllerWrapper(async (_req, _res) => {
  const {
    email,
    matricula,
    name,
    authorizationCode,
    cpf,
    password,
  }: CommitteeRegisterProps = _req.body;

  const sanitizeCPFValue = sanitizeCPF(cpf);
  const envAuthorizationCode = process.env.COMMITTEE_AUTHORIZATION_CODE;

  if (!envAuthorizationCode) {
    return _res.response.failure({
      message: 'Committee authorization code not configured',
      status: 500,
    });
  }

  if (authorizationCode !== envAuthorizationCode) {
    return _res.response.failure({
      message: 'Invalid authorization code',
      status: 403,
    });
  }

  const userAlreadyExists = await verifyCommitteeExistence(
    email,
    matricula,
    sanitizeCPFValue
  );

  if (userAlreadyExists) {
    return _res.response.failure({
      message: 'Committee user already exists',
      status: 409,
      code: 'CONFLICT',
    });
  }

  const registerUser = await handlerCommitteeRegister(
    email,
    matricula,
    name,
    sanitizeCPFValue,
    password
  );

  if (registerUser) {
    if (registerUser.error) {
      return _res.response.failure({
        message: registerUser.message,
        status: registerUser.status,
        code: registerUser.code || 'INTERNAL_SERVER_ERROR',
      });
    } else {
      return _res.response.success({
        status: registerUser.status,
        message: 'Committee user registered successfully',
        data: {
          token: (registerUser.data as any)?.token || null,
        },
      });
    }
  }

  return _res.response.failure({
    message: 'Failed to register committee user',
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
  });
});
