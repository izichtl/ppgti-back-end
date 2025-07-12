import { createHash } from 'crypto';
import { JWT_SECRET } from '../config';

export const hashPassword = (password: string): string => {
  const hash = createHash('sha256');
  hash.update(password + JWT_SECRET);
  return hash.digest('hex');
};

export const verifyPassword = (
  password: string,
  hashedPassword: string
): boolean => {
  const hashedInput = hashPassword(password);
  return hashedInput === hashedPassword;
};
