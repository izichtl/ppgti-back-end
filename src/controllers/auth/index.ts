import {
  response,
  // ResponsePayload
} from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import AppDataSource from '../../db';
import { signToken } from '../../middlewares/auth';
// import { authGuard, getUserFromToken } from '../../middlewares/auth/index';

// // guard-jwt
// const guardResponse: ResponsePayload = authGuard(token as string);
// if (guardResponse.error) {
//   return response.failure(guardResponse);
// }

export const candidateLogin = controllerWrapper(async (_req, _res) => {
  const { email, cpf } = _req.body;
  let token: string = '';

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const user = await AppDataSource.query(
    `
    SELECT * FROM candidates
    WHERE email = $1 AND cpf = $2
  `,
    [email, cpf]
  );

  console.log(user, 'user');
  if (user[0] === undefined) {
    return response.failure({
      message: 'User not found',
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
