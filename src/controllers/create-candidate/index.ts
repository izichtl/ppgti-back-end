// TODO AJUSTAR FUNCAO DE RETORNO DO MODEL
import { controllerWrapper } from '../../lib/controllerWrapper';
import { sanitizeCPF } from '../../utils/string-format';
import { verifyUserExistence } from '../../models/candidate-login';
import { handlerCadidateRegister } from '../../models/candidate-register';


export const candidateRegister = controllerWrapper(async (_req, _res) => {
  const { email, cpf, social_name } = _req.body;
  const sanitizeCPFValue = sanitizeCPF(cpf);

  // verifica se o usuário existe
  const verifyUser = await verifyUserExistence(email, sanitizeCPFValue);

  if (verifyUser !== null) {
    if (verifyUser.error && verifyUser.message !== 'User not found') {
      return _res.response.failure(verifyUser);
    }
    if (!verifyUser.error) {
      return _res.response.success(verifyUser);
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
      return _res.response.failure(registerUser);
    } else {
      return _res.response.success(registerUser);
    }
  }
});
