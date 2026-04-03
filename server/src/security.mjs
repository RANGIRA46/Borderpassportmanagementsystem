import { randomBytes, scryptSync, timingSafeEqual, randomUUID } from 'node:crypto';
import { config } from './config.mjs';
import { readDb, writeDb, nowIso, hashPassword } from './store.mjs';

export function verifyPassword(password, passwordHash) {
  const [salt, digest] = String(passwordHash || '').split(':');
  if (!salt || !digest) return false;
  const derived = scryptSync(password, salt, 64);
  const stored = Buffer.from(digest, 'hex');
  return stored.length === derived.length && timingSafeEqual(stored, derived);
}

export function sanitizeUser(user) {
  return {
    userId: user.userId,
    nationalId: user.nationalId,
    email: user.email,
    phone: user.phone,
    role: user.role,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    nationality: user.nationality,
    placeOfBirth: user.placeOfBirth,
    country: user.country,
    preferredLanguage: user.preferredLanguage,
    isActive: user.isActive,
    isVerified: user.isVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function createSession(userId, metadata = {}) {
  const accessToken = randomBytes(24).toString('hex');
  const refreshToken = randomBytes(24).toString('hex');
  const createdAt = nowIso();
  await writeDb(async (db) => {
    db.sessions.push({
      sessionId: randomUUID(),
      userId,
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + config.tokenTtlMs).toISOString(),
      refreshExpiresAt: new Date(Date.now() + config.refreshTtlMs).toISOString(),
      ipAddress: metadata.ipAddress || null,
      userAgent: metadata.userAgent || null,
      createdAt,
      updatedAt: createdAt,
    });
    return db;
  });
  return {
    accessToken,
    refreshToken,
    expiresAt: new Date(Date.now() + config.tokenTtlMs).toISOString(),
  };
}

export async function getAuthContext(authorizationHeader) {
  const token = authorizationHeader?.startsWith('Bearer ') ? authorizationHeader.slice(7) : null;
  if (!token) return null;
  const db = await readDb();
  const session = db.sessions.find(
    (entry) => entry.accessToken === token && new Date(entry.expiresAt).getTime() > Date.now()
  );
  if (!session) return null;
  const user = db.users.find((entry) => entry.userId === session.userId && entry.isActive);
  if (!user) return null;
  return { db, session, user };
}

export async function refreshSession(refreshToken) {
  const db = await readDb();
  const session = db.sessions.find(
    (entry) => entry.refreshToken === refreshToken && new Date(entry.refreshExpiresAt).getTime() > Date.now()
  );
  if (!session) return null;

  const nextToken = randomBytes(24).toString('hex');
  const nextExpiresAt = new Date(Date.now() + config.tokenTtlMs).toISOString();
  await writeDb(async (draft) => {
    const current = draft.sessions.find((entry) => entry.sessionId === session.sessionId);
    current.accessToken = nextToken;
    current.expiresAt = nextExpiresAt;
    current.updatedAt = nowIso();
    return draft;
  });
  return { token: nextToken, refreshToken, expiresAt: nextExpiresAt };
}

export async function revokeSession(sessionId) {
  await writeDb(async (db) => {
    db.sessions = db.sessions.filter((entry) => entry.sessionId !== sessionId);
    return db;
  });
}

export async function updatePassword(userId, newPassword) {
  const changedAt = nowIso();
  await writeDb(async (db) => {
    const user = db.users.find((entry) => entry.userId === userId);
    user.passwordHash = hashPassword(newPassword);
    user.passwordChangedAt = changedAt;
    user.updatedAt = changedAt;
    return db;
  });
}
