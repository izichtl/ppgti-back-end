import {
  response,
  // ResponsePayload
} from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { getUserFromToken } from '../../middlewares/auth';
import AppDataSource from '../../db';
// import { signToken } from '../../middlewares/auth';
// import { authGuard, getUserFromToken } from '../../middlewares/auth/index';

// // guard-jwt
// const guardResponse: ResponsePayload = authGuard(token as string);
// if (guardResponse.error) {
//   return response.failure(guardResponse);
// }

export const candidateFilerList = controllerWrapper(async (_req, _res) => {
  const token = _req.headers['authorization'];
  console.log(token, 'tk');

  const user = await getUserFromToken(token as string);
  const { cpf } = user as any;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const candidateFiles = await AppDataSource.query(
    `
    SELECT
      *
    FROM candidate_documents
    WHERE cpf = $1
  `,
    [cpf]
  );

  if (candidateFiles[0] === undefined) {
    return response.failure({
      message: 'User data not found',
      status: 404,
    });
  }

  response.success({
    status: 200,
    data: candidateFiles,
  });
});
