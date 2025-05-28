import type { Request, Response, NextFunction } from 'express';
import { getUserFromToken, authGuard } from './index';
import { response } from '../response';
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
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      response.unauthorized({
        message: 'Authorization token required',
        status: 401,
      });
      return;
    }

    const token = authHeader;

    // Validate token
    const guardResponse = authGuard(token);
    if (guardResponse.error) {
      response.unauthorized({
        message: guardResponse.message,
        status: guardResponse.status,
      });
      return;
    }

    // Get user from token
    const decoded = await getUserFromToken(token);

    if (!decoded || typeof decoded === 'string') {
      response.unauthorized({
        message: 'Invalid token',
        status: 401,
      });
      return;
    }

    // Verify user is a committee member
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const committeeUser = await AppDataSource.query(
      `SELECT * FROM committee_members WHERE id = $1`,
      [(decoded as any).id]
    );

    if (!committeeUser || committeeUser.length === 0) {
      response.unauthorized({
        message: 'Access denied. Committee member required.',
        status: 403,
      });
      return;
    }

    // Add user to request object
    req.user = committeeUser[0];
    next();
  } catch (error) {
    console.error('Committee auth middleware error:', error);
    response.failure({
      message: 'Authentication failed',
      status: 500,
    });
  }
};
