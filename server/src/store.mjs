import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomBytes, randomUUID, scryptSync } from 'node:crypto';
import { config } from './config.mjs';

let writeQueue = Promise.resolve();

export function nowIso() {
  return new Date().toISOString();
}

export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

function seedUser({ email, password, role, firstName, lastName, nationality = 'RWA' }) {
  const createdAt = nowIso();
  return {
    userId: randomUUID(),
    nationalId: `${role.toUpperCase().slice(0, 3)}${Math.floor(Math.random() * 1e9).toString().padStart(9, '0')}`,
    email,
    phone: '',
    passwordHash: hashPassword(password),
    role,
    firstName,
    middleName: '',
    lastName,
    dateOfBirth: '1990-01-01',
    gender: 'X',
    nationality,
    placeOfBirth: '',
    motherName: '',
    fatherName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    country: nationality,
    preferredLanguage: 'en',
    isActive: true,
    isVerified: true,
    lastLogin: null,
    createdAt,
    updatedAt: createdAt,
    createdBy: null,
    updatedBy: null,
    failedLoginAttempts: 0,
    accountLockedUntil: null,
    passwordChangedAt: createdAt,
    twoFactorEnabled: false,
    twoFactorSecret: null,
    consentDataProcessing: true,
    consentBiometricStorage: true,
    consentTermsConditions: true,
    consentDate: createdAt,
  };
}

export function createDefaultDb() {
  const createdAt = nowIso();
  const admin = seedUser({
    email: config.defaultAdminEmail,
    password: config.defaultAdminPassword,
    role: 'admin',
    firstName: 'System',
    lastName: 'Administrator',
  });
  const officer = seedUser({
    email: config.defaultOfficerEmail,
    password: config.defaultOfficerPassword,
    role: 'officer',
    firstName: 'Border',
    lastName: 'Officer',
  });

  return {
    meta: { createdAt, updatedAt: createdAt, schemaVersion: 2 },
    users: [admin, officer],
    sessions: [],
    digitalPassports: [],
    biometricData: [],
    borderCrossingRecords: [],
    watchlistRecords: [],
    payments: [],
    auditLogs: [],
    biometricCenters: [],
    systemConfiguration: [],
    notifications: [],
    integrationSyncs: [],
    appointments: [],
  };
}

function normalize(db) {
  const defaults = createDefaultDb();
  return {
    ...defaults,
    ...db,
    meta: { ...defaults.meta, ...(db.meta || {}) },
    users: db.users || defaults.users,
    sessions: db.sessions || [],
    digitalPassports: db.digitalPassports || db.passports || [],
    biometricData: db.biometricData || [],
    borderCrossingRecords: db.borderCrossingRecords || db.borderCrossings || [],
    watchlistRecords: db.watchlistRecords || [],
    payments: db.payments || [],
    auditLogs: db.auditLogs || [],
    biometricCenters: db.biometricCenters || [],
    systemConfiguration: db.systemConfiguration || [],
    notifications: db.notifications || [],
    integrationSyncs: db.integrationSyncs || [],
    appointments: db.appointments || [],
  };
}

async function ensureFile() {
  await mkdir(config.dataDir, { recursive: true });
  if (!existsSync(config.dataFile)) {
    await writeFile(config.dataFile, JSON.stringify(createDefaultDb(), null, 2));
  }
}

export async function readDb() {
  await ensureFile();
  const raw = await readFile(config.dataFile, 'utf8');
  return normalize(JSON.parse(raw));
}

export async function writeDb(mutator) {
  writeQueue = writeQueue.then(async () => {
    const db = await readDb();
    const next = normalize((await mutator(structuredClone(db))) || db);
    next.meta.updatedAt = nowIso();
    await writeFile(config.dataFile, JSON.stringify(next, null, 2));
    return next;
  });
  return writeQueue;
}
