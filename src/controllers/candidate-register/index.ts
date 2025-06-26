// @ts-nocheck
import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { signToken } from '../../middlewares/auth/index';
import { sanitizeCPF } from '../../utils/string-format';
import { verifyUserExistence } from '../../models/candidate-login';
import e from 'express';
import { handlerCadidateRegister } from '../../models/candidate-register';

export interface ResponsePayload {
  error: boolean;
  message: string;
  status: number;
  data?: any;
}

export const candidateRegister = controllerWrapper(async (_req, _res) => {
  const { email, cpf, social_name } = _req.body;

  const sanitizeCPFValue = sanitizeCPF(cpf);
  const verifyUser = await verifyUserExistence(email, sanitizeCPFValue);

  if (verifyUser !== null) {
    if (verifyUser.error) {
      return response.failure(verifyUser);
    } else {
      return response.success(verifyUser);
    }
  }

  // se não existir, registra o usuário
  const registerUser = await handlerCadidateRegister(
    email,
    sanitizeCPFValue,
    social_name
  );

  if (registerUser !== null) {
    if (registerUser.error) {
      return response.failure(registerUser);
    } else {
      return response.success(registerUser);
    }
  }
});
