import type { Request, Response, NextFunction } from 'express';
import { getUserFromToken, authGuard } from './index';
import { response, ResponsePayload } from '../response';
import AppDataSource from '../../db';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    cpf: string;
    if_registration: string;
  };
}

export const committeeAuthMiddleware = async (
  _req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = _req.headers['authorization'];

    console.log('token', token);

    const guardResponse: ResponsePayload = authGuard(token as string);

    console.log('guardResponse', guardResponse);

    if (guardResponse.error) {
      return response.unauthorized(guardResponse);
    }

    const user = await getUserFromToken(token as string);

    console.log('user', user);

    if (!user) {
      return response.unauthorized({
        message: 'Invalid token',
        status: 401,
      });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const committeeUser = await AppDataSource.query(
      `SELECT * FROM committee_members WHERE id = $1`,
      [(user as any).id]
    );

    if (!committeeUser || committeeUser.length === 0) {
      console.log('Access denied. Committee member required.');
      response.unauthorized({
        message: 'Access denied. Committee member required.',
        status: 403,
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Committee auth middleware error:', error);
    response.failure({
      message: 'Authentication failed',
      status: 500,
    });
  }
};
