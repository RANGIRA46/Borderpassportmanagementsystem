export const config = {
  port: Number(process.env.API_PORT || process.env.PORT || 3001),
  dataDir: new URL('../data/', import.meta.url),
  dataFile: new URL('../data/db.json', import.meta.url),
  tokenTtlMs: 1000 * 60 * 60 * 12,
  refreshTtlMs: 1000 * 60 * 60 * 24 * 30,
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || 'admin@bpms.local',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'admin12345',
  defaultOfficerEmail: process.env.DEFAULT_OFFICER_EMAIL || 'officer@bpms.local',
  defaultOfficerPassword: process.env.DEFAULT_OFFICER_PASSWORD || 'officer12345',
};
