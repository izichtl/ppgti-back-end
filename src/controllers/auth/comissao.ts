import { response } from "../../middlewares/response";
import { controllerWrapper } from "../../lib/controllerWrapper";
import AppDataSource from "../../db";
import { signToken } from "../../middlewares/auth";
import { sanitizeCPF } from "../../utils/string-format";
import {
  verifyComissaoExistence,
  handlerComissaoRegister,
} from "../../models/comissao";

export type ComissaoRegisterProps = {
  email: string;
  matricula: string;
  name: string;
  authorizationCode: string;
  cpf: string;
  password: string;
};

export type ComissaoLoginProps = {
  matricula: string;
  password: string;
};

export const comissaoLogin = controllerWrapper(async (_req, _res) => {
  const { matricula, password } = _req.body;
  let token: string = "";

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const user = await AppDataSource.query(
    `
    SELECT * FROM committee_members
    WHERE if_registration = $1 AND password = $2
  `,
    [matricula, password]
  );

  console.log(user, "comissao user");

  if (user[0] === undefined) {
    return response.failure({
      message: "Committee user not found or invalid credentials",
      status: 404,
    });
  } else {
    token = await signToken(user[0]);
  }

  response.success({
    status: 200,
    data: token,
  });
});

export const comissaoRegister = controllerWrapper(async (_req, _res) => {
  const {
    email,
    matricula,
    name,
    authorizationCode,
    cpf,
    password,
  }: ComissaoRegisterProps = _req.body;

  const sanitizeCPFValue = sanitizeCPF(cpf);
  const envAuthorizationCode = process.env.COMMITTEE_AUTHORIZATION_CODE;

  if (!envAuthorizationCode) {
    return response.failure({
      message: "Committee authorization code not configured",
      status: 500,
    });
  }

  if (authorizationCode !== envAuthorizationCode) {
    return response.failure({
      message: "Invalid authorization code",
      status: 401,
    });
  }

  const verifyUser = await verifyComissaoExistence(
    email,
    matricula,
    sanitizeCPFValue
  );

  if (verifyUser !== null) {
    if (verifyUser.error) {
      return response.failure(verifyUser);
    } else {
      return response.success(verifyUser);
    }
  }

  const registerUser = await handlerComissaoRegister(
    email,
    matricula,
    name,
    sanitizeCPFValue,
    password
  );

  if (registerUser) {
    if (registerUser.error) {
      return response.failure(registerUser);
    } else {
      return response.success(registerUser);
    }
  }

  return response.failure({
    message: "Failed to register committee user",
    status: 500,
  });
});
