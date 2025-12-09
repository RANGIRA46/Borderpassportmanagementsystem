// Rwanda Border & Passport Management System - Constants and Configuration

export const APP_CONFIG = {
    name: 'Rwanda Border & Passport Management System',
    shortName: 'Border System',
    version: '1.0.0',
    supportPhone: '+250 788 123 456',
    emergencyPhone: '+250 788 123 000',
    supportEmail: 'support@immigration.gov.rw'
};

export const DEMO_USERS = [
    {
        id: 'usr_001',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
        permissions: ['apply_passport', 'apply_visa', 'view_status', 'book_appointment'],
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date('2024-01-21'),
        status: 'active'
    },
    {
        id: 'usr_002',
        email: 'mary.smith@immigration.gov.rw',
        firstName: 'Mary',
        lastName: 'Smith',
        role: 'officer',
        department: 'Immigration Services',
        permissions: ['process_applications', 'view_records'],
        createdAt: new Date('2024-01-10'),
        lastLogin: new Date('2024-01-21'),
        status: 'active'
    },
    {
        id: 'usr_003',
        email: 'admin@immigration.gov.rw',
        firstName: 'David',
        lastName: 'Wilson',
        role: 'admin',
        department: 'System Administration',
        permissions: ['full_access', 'user_management', 'system_config', 'analytics', 'watchlist'],
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date('2024-01-21'),
        status: 'active'
    },
    {
        id: 'usr_004',
        email: 'superadmin@immigration.gov.rw',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'super-admin',
        department: 'National Security',
        permissions: ['system_admin', 'security_oversight', 'interpol_access', 'multi_agency'],
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date('2024-01-21'),
        status: 'active'
    }
];

export const SYSTEM_STATS = {
    totalApplications: 15247,
    processingTime: "48 hours",
    successRate: 98.7,
    uptime: 99.95,
    activeUsers: 1247,
    pendingApplications: 234,
    alertsToday: 12,
    borderCrossings: 2526
};

export const COUNTRIES = [
    'Rwanda', 'Kenya', 'Uganda', 'Tanzania', 'Burundi', 'Democratic Republic of Congo',
    'South Sudan', 'Ethiopia', 'South Africa', 'Nigeria', 'Ghana', 'Morocco',
    'United States', 'United Kingdom', 'France', 'Germany', 'Belgium', 'Netherlands',
    'Canada', 'Australia', 'China', 'India', 'Japan', 'Other'
];

export const SERVICE_FEES = {
    'passport-standard': { amount: 50000, currency: 'RWF', description: 'Standard passport processing' },
    'passport-express': { amount: 100000, currency: 'RWF', description: 'Expedited processing (24-48h)' },
    'visa-tourist': { amount: 75000, currency: 'RWF', description: 'Tourist/Business visa' },
    'visa-transit': { amount: 30000, currency: 'RWF', description: 'Transit visa' },

    'document-replacement': { amount: 30000, currency: 'RWF', description: 'Lost/damaged document replacement' },
    'border-pass': { amount: 40000, currency: 'RWF', description: 'Digital border pass (1 year)' }
};

export const PAYMENT_METHODS = [
    {
        id: 'mtn-momo',
        name: 'MTN Mobile Money',
        type: 'mobile',
        icon: '📱',
        fees: '1.5%',
        processingTime: 'Instant',
        available: true
    },
    {
        id: 'airtel-money',
        name: 'Airtel Money',
        type: 'mobile',
        icon: '📱',
        fees: '1.5%',
        processingTime: 'Instant',
        available: true
    },
    {
        id: 'visa-card',
        name: 'Visa Card',
        type: 'card',
        icon: '💳',
        fees: '2.9% + $0.30',
        processingTime: '2-3 minutes',
        available: true
    },
    {
        id: 'mastercard',
        name: 'MasterCard',
        type: 'card',
        icon: '💳',
        fees: '2.9% + $0.30',
        processingTime: '2-3 minutes',
        available: true
    },
    {
        id: 'bank-transfer',
        name: 'Bank Transfer',
        type: 'bank',
        icon: '🏦',
        fees: 'Free',
        processingTime: '1-2 business days',
        available: true
    }
];

export const NAVIGATION_ITEMS = {
    customer: [
        { id: 'home', label: 'Home', icon: '🏠', type: 'single' },
        { id: 'overview', label: 'About', icon: '📋', type: 'single' },
        {
            id: 'services',
            label: 'Services',
            icon: '🎯',
            type: 'dropdown',
            items: [
                { id: 'apply-passport', label: 'Apply for Passport', icon: '📘' },
                { id: 'apply-visa', label: 'Apply for Visa', icon: '📄' },
                { id: 'appointments', label: 'Book Appointment', icon: '📅' },
                { id: 'status', label: 'Check Status', icon: '🔍' }
            ]
        },
        {
            id: 'support',
            label: 'Support',
            icon: '💬',
            type: 'dropdown',
            items: [
                { id: 'documents', label: 'Upload Documents', icon: '📎' },
                { id: 'payments', label: 'Payment Center', icon: '💳' },
                { id: 'border-pass', label: 'Digital Pass', icon: '🎫' }
            ]
        }
    ],
    admin: [
        { id: 'home', label: 'Dashboard', icon: '📊', type: 'single' },
        {
            id: 'processing',
            label: 'Processing',
            icon: '⚙️',
            type: 'dropdown',
            items: [
                { id: 'apply-passport', label: 'Passport Applications', icon: '📘' },
                { id: 'apply-visa', label: 'Visa Applications', icon: '📄' },
                { id: 'appointments', label: 'Appointments', icon: '📅' },
                { id: 'payments', label: 'Payment Processing', icon: '💳' }
            ]
        },
        {
            id: 'border-control',
            label: 'Border Control',
            icon: '🛂',
            type: 'dropdown',
            items: [
                { id: 'entry-exit', label: 'Entry/Exit Logging', icon: '🚪' },
                { id: 'records', label: 'Travel Records', icon: '📊' },
                { id: 'status', label: 'Status Verification', icon: '🔍' }
            ]
        },

        {
            id: 'security',
            label: 'Security',
            icon: '🔒',
            type: 'dropdown',
            items: [
                { id: 'interpol', label: 'INTERPOL', icon: '🌐' },
                { id: 'alerts', label: 'Watchlist', icon: '⚠️' },
                { id: 'agencies', label: 'Multi-Agency', icon: '👥' }
            ]
        },
        { id: 'analytics', label: 'Analytics', icon: '📈', type: 'single' },
        { id: 'admin-dashboard', label: 'Administration', icon: '⚙️', type: 'single' }
    ]
};

export const PAGE_ACCESS = {
    public: [
        'home', 'overview', 'apply-passport', 'apply-visa',
        'appointments', 'documents', 'payments', 'status', 'login'
    ],
    customer: [
        'home', 'overview', 'apply-passport', 'apply-visa',
        'appointments', 'documents', 'payments', 'status', 'login', 'border-pass'
    ],
    officer: [
        'home', 'overview', 'apply-passport', 'apply-visa',
        'appointments', 'documents', 'payments', 'status', 'login', 'border-pass',
        'records', 'entry-exit'
    ],
    admin: [
        'home', 'overview', 'apply-passport', 'apply-visa',
        'appointments', 'documents', 'payments', 'status', 'login', 'border-pass',
        'records', 'entry-exit',
        'admin-dashboard', 'analytics', 'alerts', 'agencies', 'interpol'
    ]
};