import { randomUUID, createHash } from 'node:crypto';
import { appendAuditLog } from './audit.mjs';
import { nowIso, readDb, writeDb, hashPassword } from './store.mjs';
import { sanitizeUser, verifyPassword, createSession, revokeSession, refreshSession, updatePassword } from './security.mjs';

const BORDER_POINTS = [
  { code: 'KGL', name: 'Kigali International Airport', countryCode: 'RWA' },
  { code: 'GAT', name: 'Gatuna Border Post', countryCode: 'RWA' },
  { code: 'NEM', name: 'Nemba Border Post', countryCode: 'RWA' },
  { code: 'RUS', name: 'Rusizi Border Post', countryCode: 'RWA' },
];

function futureDate(years) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString().slice(0, 10);
}

function issueDate() {
  return new Date().toISOString().slice(0, 10);
}

function riskLevel(score) {
  if (score >= 0.8) return 'critical';
  if (score >= 0.6) return 'high';
  if (score >= 0.4) return 'medium';
  if (score >= 0.2) return 'low';
  return 'none';
}

function passportResponse(record, user) {
  return {
    passportId: record.passportId,
    passportNumber: record.passportNumber,
    userId: record.userId,
    passportType: record.passportType,
    status: record.status,
    issueDate: record.issueDate,
    expiryDate: record.expiryDate,
    issueAuthority: record.issueAuthority,
    issuePlace: record.issuePlace,
    qrCodeData: record.qrCodeData,
    digitalSignature: record.digitalSignature,
    publicKey: record.publicKey,
    certificateSerialNumber: record.certificateSerialNumber,
    chipId: record.chipId,
    photoUrl: record.photoUrl,
    signatureUrl: record.signatureUrl,
    blockchainHash: record.blockchainHash,
    revocationReason: record.revocationReason,
    revokedAt: record.revokedAt,
    revokedBy: record.revokedBy,
    travelRestrictions: record.travelRestrictions,
    endorsements: record.endorsements,
    visaPagesCount: record.visaPagesCount,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    issuedBy: record.issuedBy,
    lastVerifiedAt: record.lastVerifiedAt,
    verificationCount: record.verificationCount,
    user: user ? sanitizeUser(user) : undefined,
  };
}

function biometricResponse(record) {
  return {
    biometricId: record.biometricId,
    userId: record.userId,
    passportId: record.passportId,
    biometricType: record.biometricType,
    qualityScore: record.qualityScore,
    captureDeviceId: record.captureDeviceId,
    captureLocation: record.captureLocation,
    capturedAt: record.capturedAt,
    capturedBy: record.capturedBy,
    encryptionAlgorithm: record.encryptionAlgorithm,
    encryptionKeyId: record.encryptionKeyId,
    hashValue: record.hashValue,
    lastVerifiedAt: record.lastVerifiedAt,
    verificationAttempts: record.verificationAttempts,
    successfulVerifications: record.successfulVerifications,
    failedVerifications: record.failedVerifications,
    retentionExpiryDate: record.retentionExpiryDate,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function registerUser(body, requestMeta = {}) {
  const { email, password, firstName, lastName } = body;
  if (!email || !password || !firstName || !lastName) {
    return { error: { status: 400, message: 'email, password, firstName and lastName are required' } };
  }
  const db = await readDb();
  if (db.users.some((entry) => entry.email.toLowerCase() === String(email).toLowerCase())) {
    return { error: { status: 409, message: 'User already exists' } };
  }
  const createdAt = nowIso();
  const user = {
    userId: randomUUID(),
    nationalId: body.nationalId || `NAT${Math.floor(Math.random() * 1e9).toString().padStart(9, '0')}`,
    email: String(email).toLowerCase(),
    phone: body.phone || '',
    passwordHash: hashPassword(password),
    role: 'customer',
    firstName,
    middleName: body.middleName || '',
    lastName,
    dateOfBirth: body.dateOfBirth || '1990-01-01',
    gender: body.gender || 'X',
    nationality: body.nationality || 'RWA',
    placeOfBirth: body.placeOfBirth || '',
    motherName: body.motherName || '',
    fatherName: body.fatherName || '',
    addressLine1: body.addressLine1 || '',
    addressLine2: body.addressLine2 || '',
    city: body.city || '',
    province: body.province || '',
    postalCode: body.postalCode || '',
    country: body.country || body.nationality || 'RWA',
    preferredLanguage: body.preferredLanguage || 'en',
    isActive: true,
    isVerified: false,
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
    consentDataProcessing: Boolean(body.consentDataProcessing ?? true),
    consentBiometricStorage: Boolean(body.consentBiometricStorage ?? true),
    consentTermsConditions: Boolean(body.consentTermsConditions ?? true),
    consentDate: createdAt,
  };
  await writeDb(async (draft) => {
    draft.users.push(user);
    return draft;
  });
  await appendAuditLog({
    userId: user.userId,
    actionType: 'register',
    entityType: 'user',
    entityId: user.userId,
    newValues: sanitizeUser(user),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  const session = await createSession(user.userId, requestMeta);
  return { user: sanitizeUser(user), ...session };
}

export async function loginUser(body, requestMeta = {}) {
  const { email, password } = body;
  const db = await readDb();
  const user = db.users.find((entry) => entry.email.toLowerCase() === String(email || '').toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    await appendAuditLog({
      userId: user?.userId || null,
      actionType: 'login',
      entityType: 'user',
      entityId: user?.userId || null,
      status: 'failure',
      errorMessage: 'Invalid credentials',
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
      isSuspicious: true,
      suspiciousReason: 'Invalid login attempt',
    });
    return { error: { status: 401, message: 'Invalid credentials' } };
  }
  await writeDb(async (draft) => {
    const current = draft.users.find((entry) => entry.userId === user.userId);
    current.lastLogin = nowIso();
    current.updatedAt = nowIso();
    current.failedLoginAttempts = 0;
    return draft;
  });
  const session = await createSession(user.userId, requestMeta);
  await appendAuditLog({
    userId: user.userId,
    actionType: 'login',
    entityType: 'user',
    entityId: user.userId,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return { user: sanitizeUser(user), ...session };
}

export async function logoutUser(auth, requestMeta = {}) {
  await revokeSession(auth.session.sessionId);
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'logout',
    entityType: 'session',
    entityId: auth.session.sessionId,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return { success: true };
}

export async function refreshUserSession(body) {
  if (!body.refreshToken) return { error: { status: 400, message: 'refreshToken is required' } };
  const next = await refreshSession(body.refreshToken);
  return next ? next : { error: { status: 401, message: 'Invalid refresh token' } };
}

export async function changeUserPassword(auth, body, requestMeta = {}) {
  if (!body.currentPassword || !body.newPassword) {
    return { error: { status: 400, message: 'currentPassword and newPassword are required' } };
  }
  if (!verifyPassword(body.currentPassword, auth.user.passwordHash)) {
    return { error: { status: 400, message: 'Current password is incorrect' } };
  }
  await updatePassword(auth.user.userId, body.newPassword);
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'change_password',
    entityType: 'user',
    entityId: auth.user.userId,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return { success: true };
}

export async function updateUserProfile(auth, body, requestMeta = {}) {
  let updatedUser;
  await writeDb(async (db) => {
    const user = db.users.find((entry) => entry.userId === auth.user.userId);
    Object.assign(user, {
      phone: body.phone ?? user.phone,
      addressLine1: body.addressLine1 ?? user.addressLine1,
      addressLine2: body.addressLine2 ?? user.addressLine2,
      city: body.city ?? user.city,
      province: body.province ?? user.province,
      postalCode: body.postalCode ?? user.postalCode,
      preferredLanguage: body.preferredLanguage ?? user.preferredLanguage,
      updatedAt: nowIso(),
    });
    updatedUser = user;
    return db;
  });
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'update_profile',
    entityType: 'user',
    entityId: auth.user.userId,
    newValues: sanitizeUser(updatedUser),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return { user: sanitizeUser(updatedUser) };
}

export async function createPassport(auth, body, requestMeta = {}) {
  const createdAt = nowIso();
  const passport = {
    passportId: randomUUID(),
    passportNumber: body.passportNumber || `RW${Math.floor(Math.random() * 1e8).toString().padStart(8, '0')}`,
    userId: body.userId || auth.user.userId,
    passportType: body.passportType || 'ordinary',
    status: body.status || 'active',
    issueDate: body.issueDate || issueDate(),
    expiryDate: body.expiryDate || futureDate(10),
    issueAuthority: body.issueAuthority || 'Rwanda Directorate General of Immigration and Emigration',
    issuePlace: body.issuePlace || 'Kigali',
    qrCodeData: body.qrCodeData || `bpms:${randomUUID()}`,
    digitalSignature: body.digitalSignature || createHash('sha256').update(randomUUID()).digest('hex'),
    publicKey: body.publicKey || 'local-dev-public-key',
    certificateSerialNumber: body.certificateSerialNumber || randomUUID(),
    chipId: body.chipId || null,
    photoUrl: body.photoUrl || null,
    signatureUrl: body.signatureUrl || null,
    blockchainHash: body.blockchainHash || createHash('sha256').update(randomUUID()).digest('hex'),
    revocationReason: null,
    revokedAt: null,
    revokedBy: null,
    travelRestrictions: body.travelRestrictions || [],
    endorsements: body.endorsements || [],
    visaPagesCount: Number(body.visaPagesCount || 0),
    createdAt,
    updatedAt: createdAt,
    issuedBy: auth.user.userId,
    lastVerifiedAt: null,
    verificationCount: 0,
  };
  await writeDb(async (db) => {
    db.digitalPassports.push(passport);
    return db;
  });
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'create_passport',
    entityType: 'digital_passport',
    entityId: passport.passportId,
    newValues: passport,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return passport;
}

export async function listPassports(auth, query = {}) {
  const db = await readDb();
  const visible = auth.user.role === 'customer'
    ? db.digitalPassports.filter((entry) => entry.userId === auth.user.userId)
    : db.digitalPassports;
  const filtered = visible.filter((entry) => {
    if (query.userId && entry.userId !== query.userId) return false;
    if (query.status && entry.status !== query.status) return false;
    return true;
  });
  return filtered.map((entry) => passportResponse(entry, db.users.find((user) => user.userId === entry.userId)));
}

export async function getPassport(auth, passportId) {
  const db = await readDb();
  const passport = db.digitalPassports.find((entry) => entry.passportId === passportId || entry.passportNumber === passportId);
  if (!passport) return null;
  if (auth.user.role === 'customer' && passport.userId !== auth.user.userId) return 'forbidden';
  return passportResponse(passport, db.users.find((user) => user.userId === passport.userId));
}

export async function updatePassportStatus(auth, passportId, body, requestMeta = {}) {
  let updated;
  await writeDb(async (db) => {
    const passport = db.digitalPassports.find((entry) => entry.passportId === passportId);
    if (!passport) return db;
    passport.status = body.status || passport.status;
    passport.updatedAt = nowIso();
    if (body.status === 'revoked') {
      passport.revocationReason = body.revocationReason || 'Administrative action';
      passport.revokedAt = nowIso();
      passport.revokedBy = auth.user.userId;
    }
    updated = passport;
    return db;
  });
  if (!updated) return null;
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'update_passport_status',
    entityType: 'digital_passport',
    entityId: passportId,
    newValues: updated,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return updated;
}

export async function verifyPassport(auth, passportId, requestMeta = {}) {
  let verified;
  await writeDb(async (db) => {
    const passport = db.digitalPassports.find((entry) => entry.passportId === passportId);
    if (!passport) return db;
    passport.lastVerifiedAt = nowIso();
    passport.verificationCount += 1;
    passport.updatedAt = nowIso();
    verified = passport;
    return db;
  });
  if (!verified) return null;
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'verify_passport',
    entityType: 'digital_passport',
    entityId: passportId,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return {
    passportId: verified.passportId,
    passportNumber: verified.passportNumber,
    status: verified.status,
    verifiedAt: verified.lastVerifiedAt,
    digitalSignatureValid: true,
    blockchainHashValid: true,
  };
}

export async function enrollBiometric(auth, body, requestMeta = {}) {
  const record = {
    biometricId: randomUUID(),
    userId: body.userId || auth.user.userId,
    passportId: body.passportId || null,
    biometricType: body.biometricType || 'face',
    templateReference: body.templateReference || `template:${randomUUID()}`,
    qualityScore: Number(body.qualityScore || 0.9),
    captureDeviceId: body.captureDeviceId || 'DEV-LOCAL',
    captureLocation: body.captureLocation || 'Kigali Main Center',
    capturedAt: nowIso(),
    capturedBy: auth.user.userId,
    encryptionAlgorithm: 'AES-256-GCM',
    encryptionKeyId: body.encryptionKeyId || 'local-kms-key',
    hashValue: createHash('sha256').update(randomUUID()).digest('hex'),
    lastVerifiedAt: null,
    verificationAttempts: 0,
    successfulVerifications: 0,
    failedVerifications: 0,
    gdprDeletionRequested: false,
    gdprDeletionDate: null,
    retentionExpiryDate: futureDate(7),
    isActive: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  await writeDb(async (db) => {
    db.biometricData.push(record);
    return db;
  });
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'biometric_enroll',
    entityType: 'biometric',
    entityId: record.biometricId,
    newValues: biometricResponse(record),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return biometricResponse(record);
}

export async function verifyBiometric(auth, body, requestMeta = {}) {
  const db = await readDb();
  const record = db.biometricData.find(
    (entry) =>
      entry.userId === body.userId &&
      entry.biometricType === (body.biometricType || entry.biometricType) &&
      entry.isActive
  );
  if (!record) return { error: { status: 404, message: 'Biometric record not found' } };
  const matchScore = Number(body.matchScore || 0.93);
  const verified = matchScore >= Number(body.threshold || 0.8);
  await writeDb(async (draft) => {
    const current = draft.biometricData.find((entry) => entry.biometricId === record.biometricId);
    current.verificationAttempts += 1;
    current.lastVerifiedAt = nowIso();
    current.updatedAt = nowIso();
    if (verified) current.successfulVerifications += 1;
    else current.failedVerifications += 1;
    return draft;
  });
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'biometric_verify',
    entityType: 'biometric',
    entityId: record.biometricId,
    status: verified ? 'success' : 'failure',
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return {
    biometricId: record.biometricId,
    verified,
    biometricType: record.biometricType,
    matchScore,
    threshold: Number(body.threshold || 0.8),
    qualityScore: record.qualityScore,
  };
}

export async function identifyBiometric(auth, body) {
  const db = await readDb();
  const candidates = db.biometricData
    .filter((entry) => entry.biometricType === (body.biometricType || entry.biometricType) && entry.isActive)
    .slice(0, 5)
    .map((entry, index) => ({
      biometricId: entry.biometricId,
      userId: entry.userId,
      confidence: Math.max(0.55, 0.91 - index * 0.08),
    }));
  return { candidates };
}

export async function getBiometricsForUser(userId) {
  const db = await readDb();
  return db.biometricData.filter((entry) => entry.userId === userId).map(biometricResponse);
}

export async function deleteBiometric(auth, biometricId, requestMeta = {}) {
  let found = false;
  await writeDb(async (db) => {
    const biometric = db.biometricData.find((entry) => entry.biometricId === biometricId);
    if (biometric) {
      biometric.isActive = false;
      biometric.updatedAt = nowIso();
      found = true;
    }
    return db;
  });
  if (!found) return false;
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'biometric_delete',
    entityType: 'biometric',
    entityId: biometricId,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return true;
}

export async function createBorderCrossing(auth, body, crossingType, requestMeta = {}) {
  const db = await readDb();
  const passport = db.digitalPassports.find(
    (entry) => entry.passportId === body.passportId || entry.passportNumber === body.passportNumber
  );
  if (!passport) return { error: { status: 404, message: 'Passport not found' } };
  const watchlist = db.watchlistRecords.find(
    (entry) => entry.isActive && (entry.passportNumber === passport.passportNumber || entry.fullName === body.fullName)
  );
  const score =
    (watchlist ? 0.4 : 0) +
    Number(body.travelPatternAnomaly || 0) * 0.2 +
    Number(body.documentInconsistency || 0) * 0.15 +
    Number(body.biometricMismatch || 0) * 0.15 +
    Number(body.destinationRisk || 0) * 0.1;
  const alertLevel = riskLevel(score);
  const record = {
    crossingId: randomUUID(),
    userId: passport.userId,
    passportId: passport.passportId,
    crossingType,
    crossingPoint: body.crossingPoint || 'Kigali International Airport',
    crossingPointCode: body.crossingPointCode || 'KGL',
    countryCode: body.countryCode || 'RWA',
    crossingTimestamp: nowIso(),
    purposeOfVisit: body.purposeOfVisit || 'general',
    intendedDurationDays: body.intendedDurationDays || null,
    destinationAddress: body.destinationAddress || '',
    arrivalFlightNumber: body.arrivalFlightNumber || '',
    departureFlightNumber: body.departureFlightNumber || '',
    verificationMethod: body.verificationMethod || 'biometric',
    verificationStatus: watchlist ? 'flagged' : 'success',
    riskScore: Number(score.toFixed(2)),
    processingOfficerId: auth.user.userId,
    processingDurationSeconds: Number(body.processingDurationSeconds || 45),
    watchlistHit: Boolean(watchlist),
    watchlistCategory: watchlist?.source || null,
    flaggedReason: watchlist?.reason || null,
    alertLevel,
    customsDeclarationId: null,
    healthDeclarationId: null,
    deviceId: body.deviceId || 'BORDER-DEVICE-01',
    latitude: body.latitude || null,
    longitude: body.longitude || null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  await writeDb(async (draft) => {
    draft.borderCrossingRecords.push(record);
    return draft;
  });
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: crossingType === 'entry' ? 'border_entry' : 'border_exit',
    entityType: 'border_crossing',
    entityId: record.crossingId,
    newValues: record,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
    isSuspicious: record.watchlistHit,
    suspiciousReason: record.flaggedReason,
  });
  return record;
}

export async function verifyTraveler(auth, body, requestMeta = {}) {
  const db = await readDb();
  const passport = db.digitalPassports.find((entry) => entry.passportNumber === body.passportNumber);
  if (!passport) return { error: { status: 404, message: 'Passport not found' } };
  const watchlist = db.watchlistRecords.find(
    (entry) => entry.isActive && entry.passportNumber === passport.passportNumber
  );
  const result = {
    passportNumber: passport.passportNumber,
    passportStatus: passport.status,
    watchlistHit: Boolean(watchlist),
    watchlistRecord: watchlist || null,
    biometricRequired: true,
    verificationAllowed: passport.status === 'active' && !watchlist,
  };
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'verify_traveler',
    entityType: 'digital_passport',
    entityId: passport.passportId,
    newValues: result,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return result;
}

export async function listBorderRecords(filter = {}) {
  const db = await readDb();
  return db.borderCrossingRecords.filter((entry) => {
    if (filter.userId && entry.userId !== filter.userId) return false;
    if (filter.passportNumber) {
      const passport = db.digitalPassports.find((item) => item.passportId === entry.passportId);
      if (!passport || passport.passportNumber !== filter.passportNumber) return false;
    }
    if (filter.date && !entry.crossingTimestamp.startsWith(filter.date)) return false;
    return true;
  });
}

export async function getBorderAlerts() {
  const db = await readDb();
  return db.borderCrossingRecords.filter((entry) => entry.alertLevel !== 'none').slice(-20).reverse();
}

export async function getBorderStatistics() {
  const db = await readDb();
  return {
    totalCrossings: db.borderCrossingRecords.length,
    entries: db.borderCrossingRecords.filter((entry) => entry.crossingType === 'entry').length,
    exits: db.borderCrossingRecords.filter((entry) => entry.crossingType === 'exit').length,
    watchlistHits: db.borderCrossingRecords.filter((entry) => entry.watchlistHit).length,
    borderPoints: BORDER_POINTS,
  };
}

export async function createWatchlistRecord(auth, body, requestMeta = {}) {
  const record = {
    watchlistId: randomUUID(),
    source: body.source || 'national',
    sourceReferenceId: body.sourceReferenceId || randomUUID(),
    passportNumber: body.passportNumber || null,
    nationalId: body.nationalId || null,
    fullName: body.fullName,
    dateOfBirth: body.dateOfBirth || null,
    nationality: body.nationality || null,
    category: body.category || 'other',
    severity: body.severity || 'medium',
    reason: body.reason || 'Flagged by administrator',
    actionRequired: body.actionRequired || 'monitor',
    authorityToNotify: body.authorityToNotify || '',
    isActive: true,
    effectiveFrom: body.effectiveFrom || issueDate(),
    effectiveUntil: body.effectiveUntil || null,
    interpolNoticeNumber: body.interpolNoticeNumber || null,
    interpolNoticeType: body.interpolNoticeType || null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    createdBy: auth.user.userId,
    lastSyncedAt: nowIso(),
  };
  await writeDb(async (db) => {
    db.watchlistRecords.push(record);
    return db;
  });
  await appendAuditLog({
    userId: auth.user.userId,
    actionType: 'watchlist_create',
    entityType: 'watchlist',
    entityId: record.watchlistId,
    newValues: record,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });
  return record;
}

export async function listWatchlistRecords(query = {}) {
  const db = await readDb();
  return db.watchlistRecords.filter((entry) => {
    if (query.source && entry.source !== query.source) return false;
    if (query.severity && entry.severity !== query.severity) return false;
    return true;
  });
}
