import { useState, useEffect } from 'react';

// User Application Data Types
export interface ApplicationData {
  id: string;
  userId: string;
  type: 'passport' | 'visa' | 'border-pass';
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'completed';
  progress: number; // 0-100
  data: Record<string, any>;
  submittedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
  documents?: string[];
  appointmentId?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  reviewNotes?: string;
  biometricStatus?: 'pending' | 'enrolled' | 'verified';
  securityClearance?: 'pending' | 'cleared' | 'flagged';
  priority?: 'normal' | 'urgent' | 'expedited';
}

// Border Entry/Exit Records
export interface BorderRecord {
  id: string;
  userId: string;
  passportNumber: string;
  entryPoint: string;
  exitPoint?: string;
  entryDate: Date;
  exitDate?: Date;
  purpose: string;
  vehicleInfo?: string;
  status: 'active' | 'completed' | 'flagged';
  watchlistHit?: boolean;
  interpolCheck?: boolean;
  notes?: string;
}

// Watchlist Entry
export interface WatchlistEntry {
  id: string;
  name: string;
  nationality: string;
  passportNumber?: string;
  reason: string;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  addedBy: string;
  addedDate: Date;
  status: 'active' | 'resolved' | 'expired';
  interpolId?: string;
}

export interface UserProfile {
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    gender?: string;
    address?: string;
  };
  biometricData?: {
    enrolled: boolean;
    enrollmentDate?: Date;
    centerId?: string;
    fingerprints?: boolean;
    photo?: boolean;
    signature?: boolean;
  };
  preferences?: {
    language: string;
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface AppointmentData {
  id: string;
  userId: string;
  type: 'biometric' | 'document-submission' | 'interview' | 'collection';
  applicationId?: string;
  date: Date;
  time: string;
  location: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: Date;
}

export interface DocumentData {
  id: string;
  userId: string;
  applicationId?: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  verified: boolean;
  category: 'identity' | 'supporting' | 'biometric' | 'payment';
}

// Data Manager Class
class DataManager {
  private static instance: DataManager;
  private storagePrefix = 'border_system_';

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Clear all system capabilities and data for fresh start
  clearSystemData(): void {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // User Data Management
  getUserData(userId: string): UserProfile {
    const key = `${this.storagePrefix}user_profile_${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  }

  saveUserData(userId: string, profileData: Partial<UserProfile>): void {
    const key = `${this.storagePrefix}user_profile_${userId}`;
    const existingData = this.getUserData(userId);
    const updatedData = { ...existingData, ...profileData };
    localStorage.setItem(key, JSON.stringify(updatedData));
  }

  // Application Data Management
  getUserApplications(userId: string): ApplicationData[] {
    const key = `${this.storagePrefix}applications_${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveApplication(applicationData: ApplicationData): void {
    const applications = this.getUserApplications(applicationData.userId);
    const existingIndex = applications.findIndex(app => app.id === applicationData.id);
    
    if (existingIndex >= 0) {
      applications[existingIndex] = { ...applicationData, updatedAt: new Date() };
    } else {
      applications.push({ ...applicationData, createdAt: new Date(), updatedAt: new Date() });
    }
    
    const key = `${this.storagePrefix}applications_${applicationData.userId}`;
    localStorage.setItem(key, JSON.stringify(applications));
  }

  getApplication(userId: string, applicationId: string): ApplicationData | null {
    const applications = this.getUserApplications(userId);
    return applications.find(app => app.id === applicationId) || null;
  }

  updateApplicationStatus(userId: string, applicationId: string, status: ApplicationData['status'], progress?: number): void {
    const applications = this.getUserApplications(userId);
    const applicationIndex = applications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex >= 0) {
      applications[applicationIndex].status = status;
      applications[applicationIndex].updatedAt = new Date();
      if (progress !== undefined) {
        applications[applicationIndex].progress = progress;
      }
      
      const key = `${this.storagePrefix}applications_${userId}`;
      localStorage.setItem(key, JSON.stringify(applications));
    }
  }

  // Appointment Management
  getUserAppointments(userId: string): AppointmentData[] {
    const key = `${this.storagePrefix}appointments_${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveAppointment(appointmentData: AppointmentData): void {
    const appointments = this.getUserAppointments(appointmentData.userId);
    const existingIndex = appointments.findIndex(app => app.id === appointmentData.id);
    
    if (existingIndex >= 0) {
      appointments[existingIndex] = appointmentData;
    } else {
      appointments.push({ ...appointmentData, createdAt: new Date() });
    }
    
    const key = `${this.storagePrefix}appointments_${appointmentData.userId}`;
    localStorage.setItem(key, JSON.stringify(appointments));
  }

  // Document Management
  getUserDocuments(userId: string): DocumentData[] {
    const key = `${this.storagePrefix}documents_${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveDocument(documentData: DocumentData): void {
    const documents = this.getUserDocuments(documentData.userId);
    const existingIndex = documents.findIndex(doc => doc.id === documentData.id);
    
    if (existingIndex >= 0) {
      documents[existingIndex] = documentData;
    } else {
      documents.push(documentData);
    }
    
    const key = `${this.storagePrefix}documents_${documentData.userId}`;
    localStorage.setItem(key, JSON.stringify(documents));
  }

  // Progress Tracking
  calculateApplicationProgress(applicationData: ApplicationData): number {
    const requiredFields = {
      passport: ['personalInfo', 'documents', 'payment'],
      visa: ['personalInfo', 'documents', 'purpose', 'payment'],
      'border-pass': ['personalInfo', 'biometric', 'verification']
    };

    const fields = requiredFields[applicationData.type] || [];
    const completedFields = fields.filter(field => {
      return applicationData.data[field] && 
        (typeof applicationData.data[field] === 'object' ? 
          Object.keys(applicationData.data[field]).length > 0 : 
          applicationData.data[field]);
    });

    return Math.round((completedFields.length / fields.length) * 100);
  }

  // Clean up old or incomplete data
  cleanupUserData(userId: string): void {
    // Remove applications that are older than 30 days and still in draft
    const applications = this.getUserApplications(userId);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const cleanedApplications = applications.filter(app => {
      if (app.status === 'draft' && new Date(app.createdAt) < thirtyDaysAgo) {
        return false;
      }
      return true;
    });
    
    if (cleanedApplications.length !== applications.length) {
      const key = `${this.storagePrefix}applications_${userId}`;
      localStorage.setItem(key, JSON.stringify(cleanedApplications));
    }
  }

  // Border Records Management
  getBorderRecords(): BorderRecord[] {
    const key = `${this.storagePrefix}border_records`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveBorderRecord(record: BorderRecord): void {
    const records = this.getBorderRecords();
    const existingIndex = records.findIndex(r => r.id === record.id);
    
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    
    const key = `${this.storagePrefix}border_records`;
    localStorage.setItem(key, JSON.stringify(records));
  }

  getUserBorderRecords(userId: string): BorderRecord[] {
    const allRecords = this.getBorderRecords();
    return allRecords.filter(record => record.userId === userId);
  }

  // Watchlist Management
  getWatchlist(): WatchlistEntry[] {
    const key = `${this.storagePrefix}watchlist`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  addToWatchlist(entry: WatchlistEntry): void {
    const watchlist = this.getWatchlist();
    watchlist.push(entry);
    const key = `${this.storagePrefix}watchlist`;
    localStorage.setItem(key, JSON.stringify(watchlist));
  }

  checkWatchlist(passportNumber: string, name: string): WatchlistEntry | null {
    const watchlist = this.getWatchlist();
    return watchlist.find(entry => 
      entry.status === 'active' && 
      (entry.passportNumber === passportNumber || 
       entry.name.toLowerCase().includes(name.toLowerCase()))
    ) || null;
  }

  // System Analytics
  getSystemStats(): any {
    const applications = this.getAllApplications();
    const borderRecords = this.getBorderRecords();
    const watchlist = this.getWatchlist();

    return {
      applications: {
        total: applications.length,
        pending: applications.filter(app => app.status === 'submitted' || app.status === 'under-review').length,
        approved: applications.filter(app => app.status === 'approved').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
      },
      borderCrossings: {
        total: borderRecords.length,
        today: borderRecords.filter(record => 
          new Date(record.entryDate).toDateString() === new Date().toDateString()
        ).length,
        active: borderRecords.filter(record => record.status === 'active').length,
        flagged: borderRecords.filter(record => record.status === 'flagged').length,
      },
      security: {
        watchlistEntries: watchlist.filter(entry => entry.status === 'active').length,
        highAlerts: watchlist.filter(entry => 
          entry.status === 'active' && 
          (entry.alertLevel === 'high' || entry.alertLevel === 'critical')
        ).length,
      }
    };
  }

  private getAllApplications(): ApplicationData[] {
    const allApps: ApplicationData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.storagePrefix}applications_`)) {
        const data = localStorage.getItem(key);
        if (data) {
          const userApps = JSON.parse(data);
          allApps.push(...userApps);
        }
      }
    }
    return allApps;
  }

  // Generate unique IDs
  generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export/Import data for backup
  exportUserData(userId: string): any {
    return {
      profile: this.getUserData(userId),
      applications: this.getUserApplications(userId),
      appointments: this.getUserAppointments(userId),
      documents: this.getUserDocuments(userId),
      exportDate: new Date()
    };
  }

  importUserData(userId: string, data: any): void {
    if (data.profile) this.saveUserData(userId, data.profile);
    if (data.applications) {
      const key = `${this.storagePrefix}applications_${userId}`;
      localStorage.setItem(key, JSON.stringify(data.applications));
    }
    if (data.appointments) {
      const key = `${this.storagePrefix}appointments_${userId}`;
      localStorage.setItem(key, JSON.stringify(data.appointments));
    }
    if (data.documents) {
      const key = `${this.storagePrefix}documents_${userId}`;
      localStorage.setItem(key, JSON.stringify(data.documents));
    }
  }
}

// React Hook for using DataManager
export function useDataManager() {
  const [dataManager] = useState(() => DataManager.getInstance());
  
  return {
    // User Profile
    getUserProfile: (userId: string) => dataManager.getUserData(userId),
    saveUserProfile: (userId: string, data: Partial<UserProfile>) => dataManager.saveUserData(userId, data),
    
    // Applications
    getUserApplications: (userId: string) => dataManager.getUserApplications(userId),
    saveApplication: (data: ApplicationData) => dataManager.saveApplication(data),
    getApplication: (userId: string, appId: string) => dataManager.getApplication(userId, appId),
    updateApplicationStatus: (userId: string, appId: string, status: ApplicationData['status'], progress?: number) => 
      dataManager.updateApplicationStatus(userId, appId, status, progress),
    
    // Appointments
    getUserAppointments: (userId: string) => dataManager.getUserAppointments(userId),
    saveAppointment: (data: AppointmentData) => dataManager.saveAppointment(data),
    
    // Documents
    getUserDocuments: (userId: string) => dataManager.getUserDocuments(userId),
    saveDocument: (data: DocumentData) => dataManager.saveDocument(data),
    
    // Border Records
    getBorderRecords: () => dataManager.getBorderRecords(),
    saveBorderRecord: (record: BorderRecord) => dataManager.saveBorderRecord(record),
    getUserBorderRecords: (userId: string) => dataManager.getUserBorderRecords(userId),
    
    // Watchlist
    getWatchlist: () => dataManager.getWatchlist(),
    addToWatchlist: (entry: WatchlistEntry) => dataManager.addToWatchlist(entry),
    checkWatchlist: (passportNumber: string, name: string) => dataManager.checkWatchlist(passportNumber, name),
    
    // Analytics
    getSystemStats: () => dataManager.getSystemStats(),
    
    // Utilities
    generateId: () => dataManager.generateId(),
    calculateProgress: (data: ApplicationData) => dataManager.calculateApplicationProgress(data),
    cleanupData: (userId: string) => dataManager.cleanupUserData(userId),
    clearSystemData: () => dataManager.clearSystemData(),
    
    // Backup
    exportData: (userId: string) => dataManager.exportUserData(userId),
    importData: (userId: string, data: any) => dataManager.importUserData(userId, data)
  };
}

// React Hook for Application State Management
export function useApplicationState(userId: string, applicationType: ApplicationData['type']) {
  const dataManager = useDataManager();
  const [currentApplication, setCurrentApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      // Look for existing draft application
      const applications = dataManager.getUserApplications(userId);
      const draftApp = applications.find(app => 
        app.type === applicationType && app.status === 'draft'
      );
      
      if (draftApp) {
        setCurrentApplication(draftApp);
      } else {
        // Create new application
        const newApp: ApplicationData = {
          id: dataManager.generateId(),
          userId,
          type: applicationType,
          status: 'draft',
          progress: 0,
          data: {},
          updatedAt: new Date(),
          createdAt: new Date()
        };
        setCurrentApplication(newApp);
        dataManager.saveApplication(newApp);
      }
    }
  }, [userId, applicationType]);

  const updateApplication = (data: Partial<ApplicationData['data']>) => {
    if (currentApplication) {
      const updatedApp = {
        ...currentApplication,
        data: { ...currentApplication.data, ...data },
        updatedAt: new Date()
      };
      
      // Calculate progress
      updatedApp.progress = dataManager.calculateProgress(updatedApp);
      
      setCurrentApplication(updatedApp);
      dataManager.saveApplication(updatedApp);
    }
  };

  const submitApplication = async () => {
    if (currentApplication && currentApplication.progress >= 80) {
      setLoading(true);
      
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const submittedApp = {
        ...currentApplication,
        status: 'submitted' as const,
        submittedAt: new Date(),
        updatedAt: new Date()
      };
      
      setCurrentApplication(submittedApp);
      dataManager.saveApplication(submittedApp);
      setLoading(false);
      
      return true;
    }
    return false;
  };

  return {
    application: currentApplication,
    updateApplication,
    submitApplication,
    loading,
    canSubmit: currentApplication?.progress >= 80
  };
}

// React Hook for Border Management
export function useBorderManager() {
  const dataManager = useDataManager();
  const [activeRecords, setActiveRecords] = useState<BorderRecord[]>([]);
  const [watchlistAlerts, setWatchlistAlerts] = useState<WatchlistEntry[]>([]);

  useEffect(() => {
    // Load active border records
    const records = dataManager.getBorderRecords();
    setActiveRecords(records.filter(record => record.status === 'active'));
    
    // Load active watchlist entries
    const watchlist = dataManager.getWatchlist();
    setWatchlistAlerts(watchlist.filter(entry => 
      entry.status === 'active' && 
      (entry.alertLevel === 'high' || entry.alertLevel === 'critical')
    ));
  }, []);

  const logEntry = (record: Omit<BorderRecord, 'id'>) => {
    const newRecord: BorderRecord = {
      ...record,
      id: dataManager.generateId()
    };
    
    // Check watchlist
    const watchlistHit = dataManager.checkWatchlist(record.passportNumber, record.userId);
    if (watchlistHit) {
      newRecord.watchlistHit = true;
      newRecord.status = 'flagged';
    }
    
    dataManager.saveBorderRecord(newRecord);
    setActiveRecords(prev => [...prev, newRecord]);
    
    return newRecord;
  };

  const logExit = (recordId: string, exitPoint: string) => {
    const records = dataManager.getBorderRecords();
    const recordIndex = records.findIndex(r => r.id === recordId);
    
    if (recordIndex >= 0) {
      records[recordIndex].exitPoint = exitPoint;
      records[recordIndex].exitDate = new Date();
      records[recordIndex].status = 'completed';
      
      dataManager.saveBorderRecord(records[recordIndex]);
      setActiveRecords(prev => prev.filter(r => r.id !== recordId));
    }
  };

  return {
    activeRecords,
    watchlistAlerts,
    logEntry,
    logExit,
    checkWatchlist: dataManager.checkWatchlist,
    addToWatchlist: dataManager.addToWatchlist
  };
}

// React Hook for System Analytics
export function useSystemAnalytics() {
  const dataManager = useDataManager();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      setLoading(true);
      const systemStats = dataManager.getSystemStats();
      setStats(systemStats);
      setLoading(false);
    };

    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshStats = () => {
    const systemStats = dataManager.getSystemStats();
    setStats(systemStats);
  };

  return {
    stats,
    loading,
    refreshStats
  };
}

export default DataManager;