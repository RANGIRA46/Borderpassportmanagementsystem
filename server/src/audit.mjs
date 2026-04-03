import { randomUUID } from 'node:crypto';
import { nowIso, writeDb } from './store.mjs';

export async function appendAuditLog({
  userId = null,
  actionType,
  entityType = null,
  entityId = null,
  oldValues = null,
  newValues = null,
  ipAddress = null,
  userAgent = null,
  status = 'success',
  errorMessage = null,
  isSuspicious = false,
  suspiciousReason = null,
}) {
  await writeDb(async (db) => {
    db.auditLogs.push({
      logId: randomUUID(),
      userId,
      actionType,
      entityType,
      entityId,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
      requestId: randomUUID(),
      sessionId: null,
      status,
      errorMessage,
      timestamp: nowIso(),
      isSuspicious,
      suspiciousReason,
    });
    return db;
  });
}
