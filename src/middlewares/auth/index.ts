import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { ResponsePayload } from '../response';

export interface User {
  id: number;
  email: string;
  // cpf?: string;
  // sessaoid?: string;
  // permissoes?: string;
  // roles: string[];
  exp?: number;
}

export async function signToken(user: User): Promise<string> {
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
    const a = jwt.verify(token.replace('Bearer ', ''), secret);
    console.log(a, 'a');
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
