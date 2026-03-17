import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env.js';
import type { AuthPayload } from '../models/types.js';

const getSecret = () => new TextEncoder().encode(env.jwtSecret);

export const signToken = async (payload: AuthPayload): Promise<string> => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.jwtExpiresIn)
    .sign(getSecret());
};

export const verifyToken = async (token: string): Promise<AuthPayload> => {
  const { payload } = await jwtVerify(token, getSecret());
  return {
    userId: payload.userId as string,
    email: payload.email as string,
    role: payload.role as AuthPayload['role'],
  };
};
