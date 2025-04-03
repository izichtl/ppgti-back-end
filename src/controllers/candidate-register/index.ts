import { response } from '../../middlewares/response';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { signToken } from '../../middlewares/auth/index';
import AppDataSource from '../../db';

export const candidateRegister = controllerWrapper(async (_req, _res) => {
  const { email, cpf, name } = _req.body;
  let token: string = '';

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const user = await AppDataSource.query(
    `
    SELECT
      *
    FROM candidates
    WHERE email = $1 AND cpf = $2
  `,
    [email, cpf]
  );

  if (user[0] === undefined) {
    const create = await AppDataSource.query(
      `
      INSERT INTO candidates (email, cpf, name) VALUES ($1, $2, $3) RETURNING *
    `,
      [email, cpf, name]
    );
    token = await signToken(create[0]);
  } else {
    token = await signToken(user[0]);
  }

  response.success({
    message: 'Created',
    data: {
      token,
    },
    status: 201,
  });
});
