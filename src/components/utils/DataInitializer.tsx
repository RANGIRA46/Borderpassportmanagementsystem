import { useEffect, useState, useCallback } from 'react';
import { useDataManager, ApplicationData, BorderRecord, WatchlistEntry } from '../DataManager';
import { useAuth } from '../UserAuth';

// Sample data for demonstration and testing
const sampleApplications: ApplicationData[] = [
  {
    id: 'app_1',
    userId: 'user_demo',
    type: 'passport',
    status: 'under-review',
    progress: 85,
    data: {
      personalInfo: {
        firstName: 'John',
        lastName: 'Smith',
        nationality: 'United States',
        dateOfBirth: '1985-06-15'
      },
      documents: ['birth_certificate', 'id_card'],
      payment: { amount: 110, status: 'paid' }
    },
    submittedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    createdAt: new Date('2024-01-10'),
    paymentStatus: 'paid',
    biometricStatus: 'enrolled',
    priority: 'normal'
  },
  {
    id: 'app_2',
    userId: 'user_demo2',
    type: 'visa',
    status: 'approved',
    progress: 100,
    data: {
      personalInfo: {
        firstName: 'Maria',
        lastName: 'Garcia',
        nationality: 'Spain',
        dateOfBirth: '1990-03-22'
      },
      purpose: 'Tourism',
      documents: ['passport', 'invitation_letter'],
      payment: { amount: 80, status: 'paid' }
    },
    submittedAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-08'),
    paymentStatus: 'paid',
    biometricStatus: 'verified',
    priority: 'normal'
  },
  {
    id: 'app_3',
    userId: 'user_demo3',
    type: 'border-pass',
    status: 'submitted',
    progress: 75,
    data: {
      personalInfo: {
        firstName: 'Ahmed',
        lastName: 'Hassan',
        nationality: 'Egypt',
        dateOfBirth: '1988-11-08'
      },
      biometric: { enrolled: true },
      verification: { completed: false }
    },
    submittedAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    createdAt: new Date('2024-01-15'),
    biometricStatus: 'pending',
    priority: 'urgent'
  }
];

const sampleBorderRecords: BorderRecord[] = [
  {
    id: 'border_1',
    userId: 'user_demo',
    passportNumber: 'US123456789',
    entryPoint: 'International Airport Terminal 1',
    entryDate: new Date('2024-01-20T10:30:00'),
    purpose: 'Business',
    status: 'active',
    watchlistHit: false,
    interpolCheck: true
  },
  {
    id: 'border_2',
    userId: 'user_demo2',
    passportNumber: 'ES987654321',
    entryPoint: 'Port Authority Dock 3',
    exitPoint: 'International Airport Terminal 2',
    entryDate: new Date('2024-01-18T14:15:00'),
    exitDate: new Date('2024-01-20T08:45:00'),
    purpose: 'Tourism',
    status: 'completed',
    watchlistHit: false,
    interpolCheck: true
  },
  {
    id: 'border_3',
    userId: 'user_demo4',
    passportNumber: 'XX111222333',
    entryPoint: 'Land Border Checkpoint Alpha',
    entryDate: new Date('2024-01-19T16:20:00'),
    purpose: 'Transit',
    status: 'flagged',
    watchlistHit: true,
    interpolCheck: true,
    notes: 'Flagged for additional screening - resolved'
  }
];

const sampleWatchlistEntries: WatchlistEntry[] = [
  {
    id: 'watch_1',
    name: 'John Doe',
    nationality: 'Unknown',
    passportNumber: 'XX111222333',
    reason: 'Document fraud investigation',
    alertLevel: 'medium',
    addedBy: 'Officer Smith',
    addedDate: new Date('2024-01-15'),
    status: 'active'
  },
  {
    id: 'watch_2',
    name: 'Jane Wilson',
    nationality: 'Canada',
    reason: 'Outstanding warrant',
    alertLevel: 'high',
    addedBy: 'Inspector Johnson',
    addedDate: new Date('2024-01-10'),
    status: 'active',
    interpolId: 'INT-2024-001'
  },
  {
    id: 'watch_3',
    name: 'Roberto Silva',
    nationality: 'Brazil',
    passportNumber: 'BR445566778',
    reason: 'Suspected human trafficking',
    alertLevel: 'critical',
    addedBy: 'Agent Davis',
    addedDate: new Date('2024-01-08'),
    status: 'active',
    interpolId: 'INT-2024-003'
  }
];

export function useDataInitializer() {
  const dataManager = useDataManager();
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeSystemData = useCallback(() => {
    try {
      // Check if data is already initialized
      const existingStats = dataManager.getSystemStats();
      if (existingStats.applications.total > 0) {
        setIsInitialized(true);
        return;
      }

      // Initialize sample applications only if none exist
      sampleApplications.forEach(app => {
        dataManager.saveApplication(app);
      });

      // Initialize sample border records
      sampleBorderRecords.forEach(record => {
        dataManager.saveBorderRecord(record);
      });

      // Initialize sample watchlist entries
      sampleWatchlistEntries.forEach(entry => {
        dataManager.addToWatchlist(entry);
      });

      // Initialize sample user profiles
      dataManager.saveUserProfile('user_demo', {
        personalInfo: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '+1-555-0123',
          nationality: 'United States',
          dateOfBirth: '1985-06-15',
          gender: 'Male'
        },
        biometricData: {
          enrolled: true,
          enrollmentDate: new Date('2024-01-12'),
          centerId: 'center_001',
          fingerprints: true,
          photo: true,
          signature: true
        },
        preferences: {
          language: 'en',
          notifications: true,
          theme: 'light'
        }
      });

      dataManager.saveUserProfile('user_demo2', {
        personalInfo: {
          firstName: 'Maria',
          lastName: 'Garcia',
          email: 'maria.garcia@email.com',
          phone: '+34-600-123456',
          nationality: 'Spain',
          dateOfBirth: '1990-03-22',
          gender: 'Female'
        },
        biometricData: {
          enrolled: true,
          enrollmentDate: new Date('2024-01-10'),
          centerId: 'center_002',
          fingerprints: true,
          photo: true,
          signature: true
        },
        preferences: {
          language: 'es',
          notifications: true,
          theme: 'light'
        }
      });

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing system data:', error);
    }
  }, [dataManager]);

  const clearAllData = useCallback(() => {
    dataManager.clearSystemData();
    setIsInitialized(false);
    console.log('All system data cleared');
  }, [dataManager]);

  const resetToSampleData = useCallback(() => {
    clearAllData();
    setTimeout(() => {
      initializeSystemData();
    }, 100);
  }, [clearAllData, initializeSystemData]);

  useEffect(() => {
    // Initialize data silently on component mount - only run once
    let mounted = true;
    if (mounted) {
      initializeSystemData();
    }
    return () => {
      mounted = false;
    };
  }, [initializeSystemData]);

  return {
    isInitialized,
    initializeSystemData,
    clearAllData,
    resetToSampleData
  };
}

export function DataInitializer({ children }: { children: React.ReactNode }) {
  const { isInitialized } = useDataInitializer();

  // No loading screen - just initialize in background and render children immediately
  return <>{children}</>;
}

export default DataInitializer;