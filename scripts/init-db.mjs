#!/usr/bin/env node

/**
 * Database Initialization Script
 * Sets up sample data for Border Passport Management System
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../server/data/db.json');

// Sample data structure
const sampleDatabase = {
  meta: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: "1.0.0"
  },

  users: [
    {
      id: "usr_admin_001",
      email: "admin@bpms.local",
      firstName: "System",
      lastName: "Administrator",
      phone: "+250788123456",
      nationality: "Rwanda",
      role: "admin",
      passwordHash: "admin_hash_encrypted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active"
    },
    {
      id: "usr_officer_001",
      email: "officer@bpms.local",
      firstName: "Border",
      lastName: "Officer",
      phone: "+250788654321",
      nationality: "Rwanda",
      role: "officer",
      passwordHash: "officer_hash_encrypted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active"
    },
    {
      id: "usr_citizen_001",
      email: "citizen1@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "+250788111111",
      nationality: "Rwanda",
      role: "citizen",
      passwordHash: "citizen_hash_encrypted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active"
    },
    {
      id: "usr_citizen_002",
      email: "citizen2@example.com",
      firstName: "Jane",
      lastName: "Smith",
      phone: "+250788222222",
      nationality: "Kenya",
      role: "citizen",
      passwordHash: "citizen_hash_encrypted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active"
    },
    {
      id: "usr_citizen_003",
      email: "citizen3@example.com",
      firstName: "James",
      lastName: "Johnson",
      phone: "+250788333333",
      nationality: "Uganda",
      role: "citizen",
      passwordHash: "citizen_hash_encrypted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active"
    }
  ],

  passports: [
    {
      id: "PASS_001",
      userId: "usr_citizen_001",
      passportNumber: "N12345678",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-05-15",
      nationality: "Rwanda",
      gender: "M",
      issuanceDate: "2020-01-10",
      expiryDate: "2030-01-10",
      issueCountry: "Rwanda",
      status: "active",
      biometricData: { fingerprint: true, faceRecognition: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "PASS_002",
      userId: "usr_citizen_002",
      passportNumber: "K87654321",
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: "1992-08-22",
      nationality: "Kenya",
      gender: "F",
      issuanceDate: "2021-03-15",
      expiryDate: "2031-03-15",
      issueCountry: "Kenya",
      status: "active",
      biometricData: { fingerprint: true, faceRecognition: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "PASS_003",
      userId: "usr_citizen_003",
      passportNumber: "U11223344",
      firstName: "James",
      lastName: "Johnson",
      dateOfBirth: "1988-12-03",
      nationality: "Uganda",
      gender: "M",
      issuanceDate: "2019-06-20",
      expiryDate: "2029-06-20",
      issueCountry: "Uganda",
      status: "active",
      biometricData: { fingerprint: true, faceRecognition: false },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  applications: [
    {
      id: "APP_001",
      userId: "usr_citizen_001",
      type: "visa",
      purpose: "Tourism",
      destination: "Kenya",
      status: "approved",
      submittedDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      approvedDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 180)).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "APP_002",
      userId: "usr_citizen_002",
      type: "visa",
      purpose: "Business",
      destination: "Rwanda",
      status: "pending",
      submittedDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      approvedDate: null,
      expiryDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "APP_003",
      userId: "usr_citizen_003",
      type: "passport_renewal",
      purpose: "Renewal",
      destination: "Uganda",
      status: "under_review",
      submittedDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      approvedDate: null,
      expiryDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  borderCrossings: [
    {
      id: "BC_001",
      passportId: "PASS_001",
      userId: "usr_citizen_001",
      entryDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
      exitDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      entryPort: "Kigali International Airport",
      exitPort: "Kigali International Airport",
      purpose: "Tourism",
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "BC_002",
      passportId: "PASS_002",
      userId: "usr_citizen_002",
      entryDate: new Date().toISOString(),
      exitDate: null,
      entryPort: "Nairobi International Airport",
      exitPort: null,
      purpose: "Business",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "BC_003",
      passportId: "PASS_003",
      userId: "usr_citizen_003",
      entryDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
      exitDate: new Date(new Date().setDate(new Date().getDate() - 18)).toISOString(),
      entryPort: "Kampala International Airport",
      exitPort: "Kampala International Airport",
      purpose: "Visit",
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  appointments: [
    {
      id: "APT_001",
      userId: "usr_citizen_001",
      type: "biometric_enrollment",
      status: "completed",
      scheduledDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
      completedDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
      location: "Kigali Biometric Center",
      notes: "Fingerprints and face recognition completed successfully",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "APT_002",
      userId: "usr_citizen_002",
      type: "visa_interview",
      status: "scheduled",
      scheduledDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      completedDate: null,
      location: "Immigration Office",
      notes: "Business visa interview",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "APT_003",
      userId: "usr_citizen_003",
      type: "passport_pickup",
      status: "scheduled",
      scheduledDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
      completedDate: null,
      location: "Immigration Office",
      notes: "Renewed passport ready for pickup",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  alerts: [
    {
      id: "ALERT_001",
      type: "high_risk",
      priority: "high",
      title: "Passport Flagged for Verification",
      description: "Passport PASS_001 flagged for additional security verification",
      status: "active",
      createdAt: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
      updatedAt: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString()
    },
    {
      id: "ALERT_002",
      type: "system_notice",
      priority: "medium",
      title: "Biometric System Update",
      description: "Fingerprint database updated with new records",
      status: "active",
      createdAt: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(),
      updatedAt: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString()
    }
  ],

  documents: [
    {
      id: "DOC_001",
      userId: "usr_citizen_001",
      type: "passport_copy",
      fileName: "john_doe_passport.pdf",
      fileSize: 1024000,
      uploadedDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      status: "verified",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "DOC_002",
      userId: "usr_citizen_002",
      type: "proof_of_residence",
      fileName: "jane_smith_residence.pdf",
      fileSize: 512000,
      uploadedDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  sessions: [],

  settings: {
    systemName: "Border Passport Management System",
    theme: "light",
    themeMode: "system",
    language: "en",
    timezone: "UTC+2",
    maintenanceMode: false,
    lastBackup: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
  }
};

/**
 * Initialize or update the database
 */
function initializeDatabase() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`✓ Created data directory: ${dataDir}`);
    }

    // Check if db.json exists
    if (fs.existsSync(dbPath)) {
      console.log(`✓ Database file already exists: ${dbPath}`);
      console.log('Merging sample data...');

      // Read existing database
      const existingDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

      // Merge with sample data (keeping existing users and their related data)
      const mergedDb = {
        ...sampleDatabase,
        users: existingDb.users || sampleDatabase.users,
        sessions: existingDb.sessions || sampleDatabase.sessions,
        meta: {
          ...sampleDatabase.meta,
          updatedAt: new Date().toISOString()
        }
      };

      fs.writeFileSync(dbPath, JSON.stringify(mergedDb, null, 2), 'utf-8');
      console.log(`✓ Database updated with sample data`);
    } else {
      // Create new database file
      fs.writeFileSync(dbPath, JSON.stringify(sampleDatabase, null, 2), 'utf-8');
      console.log(`✓ Created new database file: ${dbPath}`);
    }

    console.log('\n Database Statistics:');
    console.log(`  - Users: ${sampleDatabase.users.length}`);
    console.log(`  - Passports: ${sampleDatabase.passports.length}`);
    console.log(`  - Applications: ${sampleDatabase.applications.length}`);
    console.log(`  - Border Crossings: ${sampleDatabase.borderCrossings.length}`);
    console.log(`  - Appointments: ${sampleDatabase.appointments.length}`);
    console.log(`  - Alerts: ${sampleDatabase.alerts.length}`);
    console.log(`  - Documents: ${sampleDatabase.documents.length}`);
    console.log('\n✓ Database initialization complete!');
    return true;
  } catch (error) {
    console.error('✗ Database initialization failed:', error.message);
    return false;
  }
}

// Run initialization
const success = initializeDatabase();
process.exit(success ? 0 : 1);

