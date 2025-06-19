// @ts-nocheck
import * as jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../../config';
import { response, ResponsePayload } from '../response';
import { getUserFromToken, authGuard } from './index';
import AppDataSource from '../../db';

export interface User {
  id: number;
  email: string;
  name: string;
  cpf: string;
  exp?: number;
}

export interface CommitteeMember {
  id: number;
  email: string;
  name: string;
  cpf: string;
  if_registration: string;
}

export async function signToken(user: User | CommitteeMember): Promise<string> {
  const secret = Buffer.from(JWT_SECRET, 'base64');

  return jwt.sign({ ...user, roles: ['USER'] }, secret, {
    expiresIn: 60 * 60 * 24 * 3, // expires in 1 day
    // expiresIn: 2592000, // expires in 30 days
  });
}

export async function getUserFromToken(
  token: string
): Promise<string | jwt.JwtPayload> {
  const secret = Buffer.from(JWT_SECRET, 'base64');
  const decoded = jwt.verify(token.replace('Bearer ', ''), secret);

  return decoded;
}

export function isTokenValid(token: string): boolean {
  try {
    const secret = Buffer.from(JWT_SECRET, 'base64');
    jwt.verify(token.replace('Bearer ', ''), secret);
    return false;
  } catch (error) {
    return true;
  }
}

export const authGuard = (token: string): ResponsePayload => {
  if (isTokenValid(token)) {
    return {
      status: 401,
      message: 'Unauthorized: Invalid Token',
      error: true,
    };
  } else {
    return {
      error: false,
    };
  }
};

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

    // if (!AppDataSource.isInitialized) {
    //   await AppDataSource.initialize();
    // }

    // const committeeUser = await AppDataSource.query(
    //   `SELECT * FROM committee_members WHERE id = $1`,
    //   [(user as any).id]
    // );

    // if (!committeeUser || committeeUser.length === 0) {
    //   console.log('Access denied. Committee member required.');
    //   response.unauthorized({
    //     message: 'Access denied. Committee member required.',
    //     status: 403,
    //   });
    //   return;
    // }

    next();
  } catch (error) {
    console.error('Committee auth middleware error:', error);
    response.failure({
      message: 'Authentication failed',
      status: 500,
    });
  }
};
