import { useState, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  googleTranslateCode: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    googleTranslateCode: "en"
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    googleTranslateCode: "fr"
  },
  {
    code: "sw",
    name: "Kiswahili",
    nativeName: "Kiswahili",
    flag: "🇹🇿",
    googleTranslateCode: "sw"
  },
  {
    code: "rw",
    name: "Kinyarwanda",
    nativeName: "Ikinyarwanda",
    flag: "🇷🇼",
    googleTranslateCode: "rw"
  }
];

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

export function LanguageSelector({ 
  currentLanguage, 
  onLanguageChange, 
  className = "" 
}: LanguageSelectorProps) {
  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-2 ${className}`}>
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedLanguage.flag}</span>
          <span className="hidden md:inline">{selectedLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onLanguageChange(language)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{language.flag}</span>
              <div>
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-xs text-muted-foreground">{language.name}</div>
              </div>
            </div>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Translation context and hook
import { createContext, useContext, ReactNode, useCallback, useMemo } from "react";

interface TranslationContextType {
  currentLanguage: string;
  translate: (key: string, fallback?: string) => string;
  setLanguage: (language: string) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Comprehensive Translation dictionary
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Navigation & General
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.status": "Check Status",
    "nav.appointments": "Appointments",
    "nav.help": "Help",
    "nav.profile": "Profile",
    "nav.dashboard": "Dashboard",
    "nav.analytics": "Analytics", 
    "nav.reports": "Reports",
    "nav.settings": "Settings",
    "nav.logout": "Sign Out",
    "nav.login": "Sign In",
    "nav.back": "Back",
    "nav.refresh": "Refresh",
    "nav.breadcrumb": "Breadcrumb",
    
    // Theme
    "theme.lightMode": "Light Mode",
    "theme.darkMode": "Dark Mode",
    "theme.switchToLight": "Switch to Light Mode",
    "theme.switchToDark": "Switch to Dark Mode",
    
    // System
    "system.welcome": "Welcome to Border & Passport Management System",
    "system.loading": "Loading...",
    "system.error": "System Error",
    "system.success": "Success",
    "system.save": "Save",
    "system.cancel": "Cancel",
    "system.delete": "Delete",
    "system.edit": "Edit",
    "system.view": "View",
    "system.download": "Download",
    "system.upload": "Upload",
    "system.search": "Search",
    "system.filter": "Filter",
    "system.sort": "Sort",
    "system.refresh": "Refresh",
    "system.back": "Back",
    "system.next": "Next",
    "system.previous": "Previous",
    "system.confirm": "Confirm",
    "system.submit": "Submit",
    
    // Forms & Fields
    "form.personalInfo": "Personal Information",
    "form.firstName": "First Name",
    "form.lastName": "Last Name",
    "form.middleName": "Middle Name",
    "form.dateOfBirth": "Date of Birth",
    "form.placeOfBirth": "Place of Birth",
    "form.nationality": "Nationality",
    "form.gender": "Gender",
    "form.maritalStatus": "Marital Status",
    "form.phoneNumber": "Phone Number",
    "form.email": "Email Address",
    "form.address": "Address",
    "form.city": "City",
    "form.province": "Province",
    "form.country": "Country",
    "form.postalCode": "Postal Code",
    "form.nationalId": "National ID",
    "form.passport": "Passport Number",
    "form.passportExpiry": "Passport Expiry Date",
    "form.profession": "Profession",
    "form.employer": "Employer",
    "form.emergencyContact": "Emergency Contact",
    "form.submit": "Submit Application",
    "form.required": "Required field",
    "form.optional": "Optional",
    "form.select": "Select...",
    "form.selectCountry": "Select Country",
    "form.uploadDocument": "Upload Document",
    
    // Applications
    "passport.title": "Passport Application",
    "passport.new": "New Passport",
    "passport.renewal": "Passport Renewal", 
    "passport.replacement": "Lost/Stolen Replacement",
    "visa.title": "Visa Application",
    "visa.tourist": "Tourist Visa",
    "visa.business": "Business Visa",
    "visa.transit": "Transit Visa",
    "visa.diplomatic": "Diplomatic Visa",
    "permit.title": "Permit Application",
    "permit.work": "Work Permit",
    "permit.residence": "Residence Permit",
    "permit.student": "Student Permit",
    "permit.investment": "Investment Permit",
    "citizenship.title": "Citizenship Application",
    "citizenship.naturalization": "Naturalization",
    "citizenship.birthRegistration": "Birth Registration",
    "citizenship.dual": "Dual Citizenship",
    "cepgl.title": "CEPGL Document Application",
    "laissezPasser.title": "Laissez-Passer Application",
    "refugee.title": "Refugee Services",
    "diaspora.title": "Diaspora Services",
    
    // Status & Progress
    "status.pending": "Pending",
    "status.approved": "Approved",
    "status.rejected": "Rejected",
    "status.processing": "Processing",
    "status.underReview": "Under Review",
    "status.documentsRequired": "Documents Required",
    "status.interviewScheduled": "Interview Scheduled",
    "status.ready": "Ready for Collection",
    "status.collected": "Collected",
    
    // Documents
    "document.birth": "Birth Certificate",
    "document.marriage": "Marriage Certificate",
    "document.divorce": "Divorce Certificate",
    "document.education": "Education Certificate",
    "document.medical": "Medical Certificate",
    "document.police": "Police Clearance",
    "document.photo": "Passport Photo",
    "document.proof": "Proof of Address",
    "document.financial": "Financial Statement",
    
    // Biometrics
    "biometric.fingerprint": "Fingerprint",
    "biometric.photo": "Photograph",
    "biometric.signature": "Signature",
    "biometric.capture": "Capture Biometrics",
    "biometric.verify": "Verify Identity",
    "biometric.quality": "Image Quality",
    
    // Payments
    "payment.fee": "Application Fee",
    "payment.processing": "Processing Fee",
    "payment.express": "Express Fee",
    "payment.total": "Total Amount",
    "payment.method": "Payment Method",
    "payment.card": "Credit/Debit Card",
    "payment.mobile": "Mobile Money",
    "payment.bank": "Bank Transfer",
    "payment.receipt": "Payment Receipt",
    
    // Messages
    "success.applicationSubmitted": "Application submitted successfully",
    "success.paymentProcessed": "Payment processed successfully",
    "success.documentUploaded": "Document uploaded successfully",
    "success.appointmentBooked": "Appointment booked successfully",
    "error.fillRequired": "Please fill all required fields",
    "error.invalidFormat": "Invalid format",
    "error.fileSize": "File size too large",
    "error.networkError": "Network error. Please try again",
    "warning.documentExpiring": "Your document is expiring soon",
    "warning.unsavedChanges": "You have unsaved changes",
    "info.processingTime": "Processing time: 7-14 business days",
    
    // Help & Support
    "help.title": "Help & Support",
    "help.faq": "Frequently Asked Questions",
    "help.contact": "Contact Support",
    "help.guides": "User Guides",
    "help.tutorials": "Video Tutorials",
    "help.documentation": "Documentation",
    "help.feedback": "Send Feedback",
    "help.reportIssue": "Report Issue",
    
    // Admin
    "admin.dashboard": "Admin Dashboard",
    "admin.users": "User Management",
    "admin.applications": "Application Management",
    "admin.reports": "Reports & Analytics",
    "admin.settings": "System Settings",
    "admin.audit": "Audit Logs",
    "admin.security": "Security",
    "admin.backup": "Backup & Recovery",
    
    // Additional Navigation & UI
    "nav.about": "About",
    "nav.applications": "Applications",
    "nav.account": "Account",
    "nav.myProfile": "My Profile",
    "nav.myApplications": "My Applications",
    "nav.signIn": "Sign In",
    "nav.signOut": "Sign Out",
    "nav.register": "Register",
    "nav.signInRegister": "Sign In / Register",
    "nav.accountSettings": "Account Settings",
    "nav.contactDirectory": "Contact Directory",
    
    // User Roles & Account Types
    "role.customer": "Customer",
    "role.officer": "Officer",
    "role.admin": "Admin",
    "role.superAdmin": "Super Admin",
    "role.customerAccount": "Customer Account",
    "role.officerAccount": "Officer Account",
    "role.adminAccount": "Admin Account",
    
    // Common UI Elements
    "ui.active": "Active",
    "ui.inactive": "Inactive",
    "ui.processing": "Processing",
    "ui.completed": "Completed",
    "ui.online": "Online",
    "ui.offline": "Offline",
    "ui.available": "Available",
    "ui.unavailable": "Unavailable",
    "ui.open": "Open",
    "ui.closed": "Closed",
    "ui.yes": "Yes",
    "ui.no": "No",
    "ui.all": "All",
    "ui.none": "None",
    "ui.new": "New",
    "ui.recent": "Recent",
    "ui.popular": "Popular",
    "ui.featured": "Featured",
    "ui.recommended": "Recommended",
    "ui.quickActions": "Quick Actions",
    "ui.recentActivity": "Recent Activity",
    "ui.systemStatus": "System Status",
    "ui.statistics": "Statistics",
    "ui.overview": "Overview",
    "ui.details": "Details",
    "ui.summary": "Summary",
    "ui.more": "More",
    "ui.less": "Less",
    "ui.showMore": "Show More",
    "ui.showLess": "Show Less",
    "ui.expand": "Expand",
    "ui.collapse": "Collapse",
    "ui.minimize": "Minimize",
    "ui.maximize": "Maximize",
    
    // Service Categories
    "service.digitalPass": "Digital Pass",
    "service.paymentCenter": "Payment Center",
    "service.documentUpload": "Document Upload",
    "service.biometricEnrollment": "Biometric Enrollment",
    "service.statusTracking": "Status Tracking",
    "service.appointmentBooking": "Appointment Booking",
    "service.borderControl": "Border Control",
    "service.identityVerification": "Identity Verification",
    "service.securityServices": "Security Services",
    "service.multiAgency": "Multi-Agency Services",
    "service.analytics": "Analytics",
    "service.reporting": "Reporting",
    "service.userManagement": "User Management",
    "service.systemSettings": "System Settings",
    
    // Admin Specific
    "admin.processing": "Processing",
    "admin.borderControl": "Border Control",
    "admin.biometrics": "Biometrics",
    "admin.security": "Security",
    "admin.analytics": "Analytics",
    "admin.management": "Management",
    "admin.entryExitLogging": "Entry/Exit Logging",
    "admin.travelRecords": "Travel Records",
    "admin.statusVerification": "Status Verification",
    "admin.enrollment": "Enrollment",
    "admin.verification": "Verification",
    "admin.centers": "Centers",
    "admin.interpol": "INTERPOL",
    "admin.watchlist": "Watchlist",
    "admin.multiAgency": "Multi-Agency",
    "admin.systemMonitoring": "System Monitoring",
    "admin.auditLogs": "Audit Logs",
    "admin.backupRestore": "Backup & Restore",
    "admin.configManager": "Configuration Manager",
    
    // System Organization
    "org.rwandaImmigration": "Rwanda Immigration",
    "org.digitalServicesPortal": "Digital Services Portal",
    "org.immigrationPortal": "Immigration Portal",
    "org.borderPassportSystem": "Border & Passport Management System",
    
    // Time & Dates
    "time.today": "Today",
    "time.yesterday": "Yesterday",
    "time.thisWeek": "This Week",
    "time.thisMonth": "This Month",
    "time.thisYear": "This Year",
    "time.lastWeek": "Last Week",
    "time.lastMonth": "Last Month",
    "time.lastYear": "Last Year",
    "time.businessDays": "business days",
    "time.workingDays": "working days",
    "time.hours": "hours",
    "time.minutes": "minutes",
    "time.seconds": "seconds",
    
    // Notifications & Messages
    "notification.welcome": "Welcome to the system",
    "notification.loginSuccess": "Login successful",
    "notification.logoutSuccess": "Logout successful",
    "notification.profileUpdated": "Profile updated successfully",
    "notification.settingsSaved": "Settings saved successfully",
    "notification.systemMaintenance": "System maintenance in progress",
    "notification.newFeature": "New feature available",
    "notification.updateAvailable": "System update available",
    
    // Error Messages
    "error.accessDenied": "Access denied. You don't have permission to view this page",
    "error.sessionExpired": "Your session has expired. Please sign in again",
    "error.serverError": "Server error occurred. Please try again later",
    "error.notFound": "Page not found",
    "error.maintenance": "System is under maintenance. Please try again later",
    
    // Support & Language
    "support.language": "Language",
    "support.helpSupport": "Help & Support",
    "support.supportLanguage": "Support & Language",
    
    // Home Page Content
    "home.welcome": "Welcome to Rwanda's Digital Border System",
    "home.description": "A comprehensive, secure platform for passport and visa applications, border management, and international database integration. Sign in for full access or continue as a guest.",
    "home.systemOverview": "System Overview",
    "home.startApplication": "Start Application",
    "home.guestAccess": "Guest Access - Limited Features",
    "home.signInFullAccess": "Sign In for Full Access",
    "home.getFullAccess": "Get Full Access to All Features",
    "home.signInBenefits": "Sign in to track applications, access your dashboard, and use advanced features. Registration is free and takes less than 2 minutes.",
    "home.applicationsProcessed": "Applications Processed",
    "home.allTime": "All time",
    "home.avgProcessingTime": "Avg Processing Time",
    "home.reductionAchieved": "reduction achieved",
    "home.borderCrossingsToday": "Border Crossings Today",
    "home.realTimeTracking": "Real-time tracking",
    "home.systemUptime": "System Uptime",
    "home.aboveTarget": "Above target",
    "home.availableServices": "Available Services",
    "home.publicLoginMore": "Public + Login for More",
    "home.ombiLaPasi": "Ombi la Pasi",
    "home.submitPassportApplication": "Submit a new passport application online",
    "home.ombiLaVisa": "Ombi la Visa",
    "home.completeVisaApplication": "Complete visa application with document upload",
    "home.angaliaHali": "Angalia Hali",
    "home.trackApplicationProgress": "Track your application progress",
    "home.miadi": "Miadi",
    "home.scheduleBiometricEnrollment": "Schedule biometric enrollment",
    "home.openService": "Open Service",
    "home.needHelp": "Need Help?",
    "home.supportAvailable": "Our support team is available 24/7 to assist with applications, appointments, and system access. Sign in for personalized support and faster resolution.",
    "home.emergency": "Emergency",
    "home.support": "Support",
    "home.onlineChatAvailable": "Online Chat Available",

    // Chatbot
    "chatbot.title": "Immigration Support Assistant",
    "chatbot.placeholder": "Type your message...",
    "chatbot.send": "Send",
    "chatbot.close": "Close Chat",
    "chatbot.open": "Open Chat Assistant",
    "chatbot.greeting": "Hello! I'm your Immigration Support Assistant. How can I help you today?",
    "chatbot.typing": "Assistant is typing...",
    "chatbot.quickActions": "Quick Actions",
    "chatbot.newChat": "New Chat",
    "chatbot.quickAction.passport": "Apply for Passport",
    "chatbot.quickAction.visa": "Apply for Visa",
    "chatbot.quickAction.status": "Check Application Status",
    "chatbot.quickAction.appointment": "Book Appointment",
    "chatbot.quickAction.requirements": "Document Requirements",
    "chatbot.quickAction.fees": "Fees & Payment",
    "chatbot.quickAction.processing": "Processing Times",
    "chatbot.quickAction.contact": "Contact Support",
    "chatbot.response.passport": "To apply for a passport, you'll need: Valid national ID, Birth certificate, Two recent passport photos, Completed application form, and applicable fees. Would you like to start your application now?",
    "chatbot.response.visa": "For visa applications, requirements vary by visa type and nationality. Generally needed: Valid passport, Completed visa form, Passport photos, Supporting documents, and visa fee. Which type of visa are you interested in?",
    "chatbot.response.status": "You can check your application status using your application reference number. Please go to 'Check Status' in the main menu or provide your reference number here.",
    "chatbot.response.appointment": "To book an appointment for biometric enrollment, go to 'Appointments' in the main menu. You'll need your application reference number. Need help with this?",
    "chatbot.response.requirements": "Document requirements vary by service type. For Passport: National ID, birth certificate, photos. For Visa: Passport, invitation letter (if applicable), travel documents, proof of funds. Which service do you need documents for?",
    "chatbot.response.fees": "Service fees: Passport (Standard - 32 pages): $60 USD or 60,000 RWF, Passport (48 pages): $100 USD, Visa (Tourist): $50 USD, Visa (Business): $100 USD. Payment methods: Mobile money, Bank transfer, Card payment.",
    "chatbot.response.processing": "Processing times: Passport (Regular): 10-15 business days, Passport (Express): 3-5 business days, Visa (Tourist): 5-7 business days, Visa (Business): 7-10 business days. Times may vary during peak seasons.",
    "chatbot.response.contact": "Contact our support team: Email: support@immigration.gov.rw, Phone: +250 788 123 456, Emergency Hotline: +250 788 000 911, Office Hours: Monday-Friday 8:00 AM - 5:00 PM. How else can I assist you?",
    "chatbot.error": "I apologize, I didn't quite understand that. Could you please rephrase or use one of the quick action buttons?",

    // Secure Chip Data & Digital Signatures
    "secureChipData.title": "Secure Chip Data & Digital Signatures",
    "secureChipData.subtitle": "PKI-based security with multi-layer biometric protection",
    "secureChipData.certified": "PKI Certified",
    "secureChipData.availableChips": "Available Chips",
    "secureChipData.overview": "Overview",
    "secureChipData.signature": "Signature",
    "secureChipData.biometric": "Biometric",
    "secureChipData.security": "Security",
    "secureChipData.verificationProgress": "Security Verification Progress",
    "secureChipData.chipInformation": "Chip Information",
    "secureChipData.chipId": "Chip ID",
    "secureChipData.documentType": "Document Type",
    "secureChipData.issueDate": "Issue Date",
    "secureChipData.expiryDate": "Expiry Date",
    "secureChipData.securityFeatures": "Security Features",
    "secureChipData.digitalSignatureValidation": "Digital Signature Validation",
    "secureChipData.signatureAlgorithm": "Signature Algorithm",
    "secureChipData.issuerCertificate": "Issuer Certificate",
    "secureChipData.publicKey": "Public Key",
    "secureChipData.signatureValid": "Digital signature is valid and verified",
    "secureChipData.downloadCertificate": "Download Certificate",
    "secureChipData.verifyCertChain": "Verify Cert Chain",
    "secureChipData.biometricSecurityLayers": "Biometric Security Layers",
    "secureChipData.biometricHash": "Biometric Hash",
    "secureChipData.lastUpdated": "Last Updated",
    "secureChipData.multiLayerSecurity": "Multi-Layer Security Analysis",
    "secureChipData.encryptionLevel": "Encryption Level",
    "secureChipData.dataIntegrity": "Data Integrity",
    "secureChipData.securityNotice": "All security layers are active and functioning normally. No threats detected.",
    "secureChipData.runSecurityScan": "Run Security Scan",
    "secureChipData.exportSecurityReport": "Export Report",
    "secureChipData.selectChip": "Select a Chip to Analyze",
    "secureChipData.selectChipDesc": "Choose a secure chip from the left panel to view its digital signature, biometric data, and security layers.",

    // Advanced Passenger Information & PNR
    "api.title": "Advanced Passenger Information (API) & PNR",
    "api.subtitle": "Real-time passenger data processing and risk assessment",
    "api.connected": "IATA Connected",
    "api.realTime": "Real-time",
    "api.liveScreening": "Live Passenger Screening in Progress",
    "api.manifest": "Flight Manifest",
    "api.passengers": "Passenger List",
    "api.watchlist": "Watchlist Check",
    "api.analytics": "Analytics",
    "api.aircraft": "Aircraft",
    "api.route": "Route",
    "api.departure": "Departure",
    "api.arrival": "Arrival",
    "api.totalPax": "Total PAX",
    "api.processed": "Processed",
    "api.flagged": "Flagged",
    "api.filters": "Passenger Filters",
    "api.flight": "Flight",
    "api.allFlights": "All Flights",
    "api.riskLevel": "Risk Level",
    "api.allRisks": "All Levels",
    "api.lowRisk": "Low Risk",
    "api.mediumRisk": "Medium Risk",
    "api.highRisk": "High Risk",
    "api.criticalRisk": "Critical Risk",
    "api.search": "Search",
    "api.searchPlaceholder": "Name, Passport, PNR...",
    "api.export": "Export",
    "api.passengerList": "Passenger List",
    "api.biometric": "Biometric",
    "api.visa": "Visa Status",
    "api.lastScreening": "Last Screening",
    "api.additionalChecks": "Additional Checks",
    "api.viewDetails": "Details",
    "api.detain": "Detain",
    "api.watchlistScreening": "Watchlist Screening Results",
    "api.passport": "Passport",
    "api.nationality": "Nationality",
    "api.viewWatchlistEntry": "View Entry",
    "api.alertSecurity": "Alert Security",
    "api.totalProcessed": "Total Processed",
    "api.last24h": "Last 24 hours",
    "api.riskDetected": "Risk Detected",
    "api.requiring": "Requiring attention",
    "api.avgProcessing": "Avg Processing",
    "api.perPassenger": "Per passenger",

    // Traveler Dashboard & Manifest
    "travelerDashboard.title": "Traveler Dashboard & Manifest",
    "travelerDashboard.subtitle": "Real-time immigration processing and queue management",
    "travelerDashboard.refresh": "Refresh",
    "travelerDashboard.export": "Export",
    "travelerDashboard.inQueue": "In Queue",
    "travelerDashboard.avgWait": "Avg Wait",
    "travelerDashboard.boothsActive": "Booths Active",
    "travelerDashboard.processingRate": "Processing Rate",
    "travelerDashboard.dashboard": "Dashboard",
    "travelerDashboard.manifest": "Manifest",
    "travelerDashboard.processing": "Processing",
    "travelerDashboard.alerts": "Alerts",
    "travelerDashboard.liveProcessing": "Live Processing Status",
    "travelerDashboard.processingStep": "Processing step 3 of 4: Biometric verification",
    "travelerDashboard.filters": "Filters",
    "travelerDashboard.search": "Search",
    "travelerDashboard.searchPlaceholder": "Name, passport, flight...",
    "travelerDashboard.status": "Status",
    "travelerDashboard.allStatuses": "All Statuses",
    "travelerDashboard.approaching": "Approaching",
    "travelerDashboard.arrived": "Arrived",
    "travelerDashboard.cleared": "Cleared",
    "travelerDashboard.detained": "Detained",
    "travelerDashboard.riskLevel": "Risk Level",
    "travelerDashboard.allRisks": "All Levels",
    "travelerDashboard.lowRisk": "Low Risk",
    "travelerDashboard.mediumRisk": "Medium Risk",
    "travelerDashboard.highRisk": "High Risk",
    "travelerDashboard.criticalRisk": "Critical Risk",
    "travelerDashboard.viewSelected": "View Selected",
    "travelerDashboard.travelerList": "Traveler List",
    "travelerDashboard.arrival": "Arrival",
    "travelerDashboard.gate": "Gate",
    "travelerDashboard.queuePosition": "Queue Position",
    "travelerDashboard.eta": "ETA",
    "travelerDashboard.documents": "Documents",
    "travelerDashboard.biometrics": "Biometrics",
    "travelerDashboard.lastUpdate": "Last update",
    "travelerDashboard.boothStatus": "Immigration Booth Status",
    "travelerDashboard.activeAlerts": "Active Alerts",

    // Risk Assessment & Analytics
    "riskAssessment.title": "Risk Assessment & Analytics",
    "riskAssessment.subtitle": "AI-powered threat detection and passenger risk analysis",
    "riskAssessment.aiPowered": "AI Powered",
    "riskAssessment.realTime": "Real-time",
    "riskAssessment.liveAssessment": "Live Risk Assessment in Progress",
    "riskAssessment.assessment": "Assessment",
    "riskAssessment.analytics": "Analytics",
    "riskAssessment.models": "Models",
    "riskAssessment.reports": "Reports",
    "riskAssessment.riskProfiles": "Risk Profiles",
    "riskAssessment.searchProfiles": "Search profiles...",
    "riskAssessment.passportNumber": "Passport Number",
    "riskAssessment.nationality": "Nationality",
    "riskAssessment.riskScore": "Risk Score",
    "riskAssessment.confidence": "Confidence",
    "riskAssessment.factors": "Factors",
    "riskAssessment.riskFactors": "Risk Factors Analysis",
    "riskAssessment.recommendations": "Security Recommendations",
    "riskAssessment.implementRecommendations": "Implement Recommendations",
    "riskAssessment.exportReport": "Export Report",
    "riskAssessment.selectProfile": "Select a Risk Profile",
    "riskAssessment.selectProfileDesc": "Choose a traveler from the left panel to view detailed risk analysis and security recommendations.",
    "riskAssessment.totalAssessments": "Total Assessments",
    "riskAssessment.highRisk": "High Risk Detected",
    "riskAssessment.avgAccuracy": "Model Accuracy",
    "riskAssessment.avgProcessingTime": "Avg Processing",
    "riskAssessment.mlModels": "Machine Learning Models",
    "riskAssessment.accuracy": "Accuracy",
    "riskAssessment.lastTrained": "Last Trained",
    "riskAssessment.parameters": "Parameters",
    "riskAssessment.viewDetails": "View Details",
    "riskAssessment.retrain": "Retrain",
    "riskAssessment.riskReports": "Risk Assessment Reports",
    "riskAssessment.dailyReport": "Daily Risk Report",
    "riskAssessment.analyticsReport": "Analytics Report",
    "riskAssessment.trendAnalysis": "Trend Analysis",
    "riskAssessment.securitySummary": "Security Summary",

    // Pre-Arrival Passenger Data
    "preArrival.title": "Pre-Arrival Passenger Data",
    "preArrival.subtitle": "Advanced passenger information processing and risk assessment before arrival",
    "preArrival.apiConnected": "API Connected",
    "preArrival.realTime": "Real-time",
    "preArrival.processingStatus": "Pre-arrival data processing in progress",
    "preArrival.overview": "Overview",
    "preArrival.flights": "Flights",
    "preArrival.passengers": "Passengers",
    "preArrival.screening": "Screening",
    "preArrival.totalFlights": "Total Flights",
    "preArrival.totalPassengers": "Total Passengers",
    "preArrival.preScreened": "Pre-screened",
    "preArrival.flagged": "Flagged",
    "preArrival.upcomingArrivals": "Upcoming Arrivals",
    "preArrival.scheduled": "Scheduled",
    "preArrival.estimated": "Estimated",
    "preArrival.screened": "Screened",
    "preArrival.dataCompleteness": "Data Completeness",
    "preArrival.origin": "Origin",
    "preArrival.destination": "Destination",
    "preArrival.totalPax": "Total PAX",
    "preArrival.passengersRequireAttention": "passengers require attention",
    "preArrival.filters": "Passenger Filters",
    "preArrival.flight": "Flight",
    "preArrival.allFlights": "All Flights",
    "preArrival.search": "Search",
    "preArrival.searchPlaceholder": "Name, passport, PNR...",
    "preArrival.status": "Status",
    "preArrival.allStatuses": "All Statuses",
    "preArrival.pending": "Pending",
    "preArrival.completed": "Completed",
    "preArrival.riskLevel": "Risk Level",
    "preArrival.allRisks": "All Levels",
    "preArrival.lowRisk": "Low Risk",
    "preArrival.mediumRisk": "Medium Risk",
    "preArrival.highRisk": "High Risk",
    "preArrival.refresh": "Refresh",
    "preArrival.export": "Export",
    "preArrival.passengerList": "Passenger List",
    "preArrival.arrivalTime": "Arrival Time",
    "preArrival.seat": "Seat",
    "preArrival.riskScore": "Risk Score",
    "preArrival.eta": "ETA Processing",
    "preArrival.documents": "Documents",
    "preArrival.biometrics": "Biometrics",
    "preArrival.visaStatus": "Visa Status",
    "preArrival.priority": "Priority",
    "preArrival.alerts": "Alerts",
    "preArrival.viewDetails": "Details",
    "preArrival.reviewFlag": "Review Flag",
    "preArrival.preScreeningResults": "Pre-screening Results",
    "preArrival.passport": "Passport",
    "preArrival.viewFullProfile": "View Full Profile",
    "preArrival.escalate": "Escalate",

    // Content & Bulletin Management
    "contentManagement.title": "Content & Bulletin Management",
    "contentManagement.subtitle": "Manage internal communications and operational bulletins",
    "contentManagement.createBulletin": "Create Bulletin",
    "contentManagement.bulletins": "Bulletins",
    "contentManagement.templates": "Templates",
    "contentManagement.analytics": "Analytics",
    "contentManagement.settings": "Settings",
    "contentManagement.filters": "Filters",
    "contentManagement.search": "Search",
    "contentManagement.searchPlaceholder": "Search bulletins...",
    "contentManagement.category": "Category",
    "contentManagement.allCategories": "All Categories",
    "contentManagement.security": "Security",
    "contentManagement.policy": "Policy",
    "contentManagement.operational": "Operational",
    "contentManagement.emergency": "Emergency",
    "contentManagement.training": "Training",
    "contentManagement.priority": "Priority",
    "contentManagement.allPriorities": "All Priorities",
    "contentManagement.lowPriority": "Low",
    "contentManagement.mediumPriority": "Medium",
    "contentManagement.highPriority": "High",
    "contentManagement.criticalPriority": "Critical",
    "contentManagement.export": "Export",
    "contentManagement.bulletinList": "Bulletin List",
    "contentManagement.author": "Author",
    "contentManagement.status": "Status",
    "contentManagement.content": "Content",
    "contentManagement.targetAudience": "Target Audience",
    "contentManagement.languages": "Languages",
    "contentManagement.readCount": "Read Count",
    "contentManagement.acknowledged": "Acknowledged",
    "contentManagement.publish": "Publish Bulletin",
    "contentManagement.selectBulletin": "Select a Bulletin",
    "contentManagement.selectBulletinDesc": "Choose a bulletin from the list to view details and manage its content.",
    "contentManagement.notificationTemplates": "Notification Templates",
    "contentManagement.subject": "Subject",
    "contentManagement.variables": "Variables",
    "contentManagement.totalBulletins": "Total Bulletins",
    "contentManagement.published": "Published",
    "contentManagement.avgReadRate": "Avg Read Rate",
    "contentManagement.avgAckRate": "Avg Ack Rate",
    "contentManagement.languageSettings": "Language Settings",
    "contentManagement.defaultLanguage": "Default Language",
    "contentManagement.enabledLanguages": "Enabled Languages",
    "contentManagement.notificationSettings": "Notification Settings",
    "contentManagement.autoNotify": "Auto-notify on Publish",
    "contentManagement.autoNotifyDesc": "Automatically send notifications when bulletins are published",
    "contentManagement.requireAck": "Require Acknowledgment",
    "contentManagement.requireAckDesc": "Require staff to acknowledge reading critical bulletins",
    "contentManagement.createNewBulletin": "Create New Bulletin",
    "contentManagement.title": "Title",
    "contentManagement.titlePlaceholder": "Enter bulletin title...",
    "contentManagement.contentPlaceholder": "Enter bulletin content...",
    "contentManagement.cancel": "Cancel",
    "contentManagement.create": "Create"
  },
  
  fr: {
    // Navigation & General
    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.status": "Vérifier le Statut",
    "nav.appointments": "Rendez-vous",
    "nav.help": "Aide",
    "nav.profile": "Profil",
    "nav.dashboard": "Tableau de Bord",
    "nav.analytics": "Analytiques",
    "nav.reports": "Rapports",
    "nav.settings": "Paramètres",
    "nav.logout": "Se Déconnecter",
    "nav.login": "Se Connecter",
    "nav.back": "Retour",
    "nav.refresh": "Actualiser",
    "nav.breadcrumb": "Fil d'Ariane",
    
    // Theme
    "theme.lightMode": "Mode Clair",
    "theme.darkMode": "Mode Sombre",
    "theme.switchToLight": "Passer en Mode Clair",
    "theme.switchToDark": "Passer en Mode Sombre",
    
    // System
    "system.welcome": "Bienvenue dans le Système de Gestion des Frontières et Passeports",
    "system.loading": "Chargement...",
    "system.error": "Erreur Système",
    "system.success": "Succès",
    "system.save": "Enregistrer",
    "system.cancel": "Annuler",
    "system.delete": "Supprimer",
    "system.edit": "Modifier",
    "system.view": "Voir",
    "system.download": "Télécharger",
    "system.upload": "Téléverser",
    "system.search": "Rechercher",
    "system.filter": "Filtrer",
    "system.sort": "Trier",
    "system.refresh": "Actualiser",
    "system.back": "Retour",
    "system.next": "Suivant",
    "system.previous": "Précédent",
    "system.confirm": "Confirmer",
    "system.submit": "Soumettre",
    
    // Forms & Fields
    "form.personalInfo": "Informations Personnelles",
    "form.firstName": "Prénom",
    "form.lastName": "Nom de Famille",
    "form.middleName": "Deuxième Prénom",
    "form.dateOfBirth": "Date de Naissance",
    "form.placeOfBirth": "Lieu de Naissance",
    "form.nationality": "Nationalité",
    "form.gender": "Sexe",
    "form.maritalStatus": "État Civil",
    "form.phoneNumber": "Numéro de Téléphone",
    "form.email": "Adresse Email",
    "form.address": "Adresse",
    "form.city": "Ville",
    "form.province": "Province",
    "form.country": "Pays",
    "form.postalCode": "Code Postal",
    "form.nationalId": "Carte d'Identité Nationale",
    "form.passport": "Numéro de Passeport",
    "form.passportExpiry": "Date d'Expiration du Passeport",
    "form.profession": "Profession",
    "form.employer": "Employeur",
    "form.emergencyContact": "Contact d'Urgence",
    "form.submit": "Soumettre la Demande",
    "form.required": "Champ obligatoire",
    "form.optional": "Optionnel",
    "form.select": "Sélectionner...",
    "form.selectCountry": "Sélectionner un Pays",
    "form.uploadDocument": "Téléverser un Document",
    
    // Applications
    "passport.title": "Demande de Passeport",
    "passport.new": "Nouveau Passeport",
    "passport.renewal": "Renouvellement de Passeport",
    "passport.replacement": "Remplacement Perdu/Volé",
    "visa.title": "Demande de Visa",
    "visa.tourist": "Visa Touristique",
    "visa.business": "Visa d'Affaires",
    "visa.transit": "Visa de Transit",
    "visa.diplomatic": "Visa Diplomatique",
    "permit.title": "Demande de Permis",
    "permit.work": "Permis de Travail",
    "permit.residence": "Permis de Résidence",
    "permit.student": "Permis Étudiant",
    "permit.investment": "Permis d'Investissement",
    "citizenship.title": "Demande de Citoyenneté",
    "citizenship.naturalization": "Naturalisation",
    "citizenship.birthRegistration": "Enregistrement de Naissance",
    "citizenship.dual": "Double Citoyenneté",
    "cepgl.title": "Demande de Document CEPGL",
    "laissezPasser.title": "Demande de Laissez-Passer",
    "refugee.title": "Services aux Réfugiés",
    "diaspora.title": "Services de la Diaspora",
    
    // Status & Progress
    "status.pending": "En Attente",
    "status.approved": "Approuvé",
    "status.rejected": "Rejeté",
    "status.processing": "En Cours",
    "status.underReview": "En Révision",
    "status.documentsRequired": "Documents Requis",
    "status.interviewScheduled": "Entretien Programmé",
    "status.ready": "Prêt pour Collecte",
    "status.collected": "Collecté",
    
    // Documents
    "document.birth": "Acte de Naissance",
    "document.marriage": "Acte de Mariage",
    "document.divorce": "Acte de Divorce",
    "document.education": "Certificat d'Éducation",
    "document.medical": "Certificat Médical",
    "document.police": "Casier Judiciaire",
    "document.photo": "Photo de Passeport",
    "document.proof": "Justificatif de Domicile",
    "document.financial": "Relevé Financier",
    
    // Biometrics
    "biometric.fingerprint": "Empreinte Digitale",
    "biometric.photo": "Photographie",
    "biometric.signature": "Signature",
    "biometric.capture": "Capturer Biométrie",
    "biometric.verify": "Vérifier Identité",
    "biometric.quality": "Qualité d'Image",
    
    // Payments
    "payment.fee": "Frais de Demande",
    "payment.processing": "Frais de Traitement",
    "payment.express": "Frais Express",
    "payment.total": "Montant Total",
    "payment.method": "Méthode de Paiement",
    "payment.card": "Carte de Crédit/Débit",
    "payment.mobile": "Argent Mobile",
    "payment.bank": "Virement Bancaire",
    "payment.receipt": "Reçu de Paiement",
    
    // Messages
    "success.applicationSubmitted": "Demande soumise avec succès",
    "success.paymentProcessed": "Paiement traité avec succès",
    "success.documentUploaded": "Document téléversé avec succès",
    "success.appointmentBooked": "Rendez-vous réservé avec succès",
    "error.fillRequired": "Veuillez remplir tous les champs obligatoires",
    "error.invalidFormat": "Format invalide",
    "error.fileSize": "Taille de fichier trop grande",
    "error.networkError": "Erreur réseau. Veuillez réessayer",
    "warning.documentExpiring": "Votre document expire bientôt",
    "warning.unsavedChanges": "Vous avez des changements non sauvegardés",
    "info.processingTime": "Temps de traitement: 7-14 jours ouvrables",
    
    // Help & Support
    "help.title": "Aide et Support",
    "help.faq": "Questions Fréquemment Posées",
    "help.contact": "Contacter le Support",
    "help.guides": "Guides d'Utilisation",
    "help.tutorials": "Tutoriels Vidéo",
    "help.documentation": "Documentation",
    "help.feedback": "Envoyer Commentaires",
    "help.reportIssue": "Signaler un Problème",
    
    // Admin
    "admin.dashboard": "Tableau de Bord Admin",
    "admin.users": "Gestion des Utilisateurs",
    "admin.applications": "Gestion des Demandes",
    "admin.reports": "Rapports et Analytiques",
    "admin.settings": "Paramètres Système",
    "admin.audit": "Journaux d'Audit",
    "admin.security": "Sécurité",
    "admin.backup": "Sauvegarde et Récupération",
    
    // Additional Navigation & UI
    "nav.about": "À Propos",
    "nav.applications": "Demandes",
    "nav.account": "Compte",
    "nav.myProfile": "Mon Profil",
    "nav.myApplications": "Mes Demandes",
    "nav.signIn": "Se Connecter",
    "nav.signOut": "Se Déconnecter",
    "nav.register": "S'Inscrire",
    "nav.signInRegister": "Se Connecter / S'Inscrire",
    "nav.accountSettings": "Paramètres du Compte",
    "nav.contactDirectory": "Répertoire de Contacts",
    
    // User Roles & Account Types
    "role.customer": "Client",
    "role.officer": "Agent",
    "role.admin": "Administrateur",
    "role.superAdmin": "Super Administrateur",
    "role.customerAccount": "Compte Client",
    "role.officerAccount": "Compte Agent",
    "role.adminAccount": "Compte Administrateur",
    
    // Common UI Elements
    "ui.active": "Actif",
    "ui.inactive": "Inactif",
    "ui.processing": "En Cours",
    "ui.completed": "Terminé",
    "ui.online": "En Ligne",
    "ui.offline": "Hors Ligne",
    "ui.available": "Disponible",
    "ui.unavailable": "Indisponible",
    "ui.open": "Ouvert",
    "ui.closed": "Fermé",
    "ui.yes": "Oui",
    "ui.no": "Non",
    "ui.all": "Tous",
    "ui.none": "Aucun",
    "ui.new": "Nouveau",
    "ui.recent": "Récent",
    "ui.popular": "Populaire",
    "ui.featured": "En Vedette",
    "ui.recommended": "Recommandé",
    "ui.quickActions": "Actions Rapides",
    "ui.recentActivity": "Activité Récente",
    "ui.systemStatus": "État du Système",
    "ui.statistics": "Statistiques",
    "ui.overview": "Aperçu",
    "ui.details": "Détails",
    "ui.summary": "Résumé",
    "ui.more": "Plus",
    "ui.less": "Moins",
    "ui.showMore": "Afficher Plus",
    "ui.showLess": "Afficher Moins",
    "ui.expand": "Développer",
    "ui.collapse": "Réduire",
    "ui.minimize": "Minimiser",
    "ui.maximize": "Maximiser",
    
    // Service Categories
    "service.digitalPass": "Pass Numérique",
    "service.paymentCenter": "Centre de Paiement",
    "service.documentUpload": "Téléversement de Documents",
    "service.biometricEnrollment": "Enregistrement Biométrique",
    "service.statusTracking": "Suivi du Statut",
    "service.appointmentBooking": "Réservation de Rendez-vous",
    "service.borderControl": "Contrôle Frontalier",
    "service.identityVerification": "Vérification d'Identité",
    "service.securityServices": "Services de Sécurité",
    "service.multiAgency": "Services Multi-Agences",
    "service.analytics": "Analytiques",
    "service.reporting": "Rapports",
    "service.userManagement": "Gestion des Utilisateurs",
    "service.systemSettings": "Paramètres Système",
    
    // Admin Specific
    "admin.processing": "Traitement",
    "admin.borderControl": "Contrôle Frontalier",
    "admin.biometrics": "Biométrie",
    "admin.security": "Sécurité",
    "admin.analytics": "Analytiques",
    "admin.management": "Gestion",
    "admin.entryExitLogging": "Enregistrement Entrée/Sortie",
    "admin.travelRecords": "Dossiers de Voyage",
    "admin.statusVerification": "Vérification du Statut",
    "admin.enrollment": "Enregistrement",
    "admin.verification": "Vérification",
    "admin.centers": "Centres",
    "admin.interpol": "INTERPOL",
    "admin.watchlist": "Liste de Surveillance",
    "admin.multiAgency": "Multi-Agences",
    "admin.systemMonitoring": "Surveillance Système",
    "admin.auditLogs": "Journaux d'Audit",
    "admin.backupRestore": "Sauvegarde et Restauration",
    "admin.configManager": "Gestionnaire de Configuration",
    
    // System Organization
    "org.rwandaImmigration": "Immigration Rwanda",
    "org.digitalServicesPortal": "Portail des Services Numériques",
    "org.immigrationPortal": "Portail d'Immigration",
    "org.borderPassportSystem": "Système de Gestion des Frontières et Passeports",
    
    // Time & Dates
    "time.today": "Aujourd'hui",
    "time.yesterday": "Hier",
    "time.thisWeek": "Cette Semaine",
    "time.thisMonth": "Ce Mois",
    "time.thisYear": "Cette Année",
    "time.lastWeek": "Semaine Dernière",
    "time.lastMonth": "Mois Dernier",
    "time.lastYear": "Année Dernière",
    "time.businessDays": "jours ouvrables",
    "time.workingDays": "jours de travail",
    "time.hours": "heures",
    "time.minutes": "minutes",
    "time.seconds": "secondes",
    
    // Notifications & Messages
    "notification.welcome": "Bienvenue dans le système",
    "notification.loginSuccess": "Connexion réussie",
    "notification.logoutSuccess": "Déconnexion réussie",
    "notification.profileUpdated": "Profil mis à jour avec succès",
    "notification.settingsSaved": "Paramètres sauvegardés avec succès",
    "notification.systemMaintenance": "Maintenance système en cours",
    "notification.newFeature": "Nouvelle fonctionnalité disponible",
    "notification.updateAvailable": "Mise à jour système disponible",
    
    // Error Messages
    "error.accessDenied": "Accès refusé. Vous n'avez pas la permission de voir cette page",
    "error.sessionExpired": "Votre session a expiré. Veuillez vous reconnecter",
    "error.serverError": "Erreur serveur survenue. Veuillez réessayer plus tard",
    "error.notFound": "Page non trouvée",
    "error.maintenance": "Le système est en maintenance. Veuillez réessayer plus tard",
    
    // Support & Language
    "support.language": "Langue",
    "support.helpSupport": "Aide et Support",
    "support.supportLanguage": "Support et Langue",
    
    // Home Page Content
    "home.welcome": "Bienvenue dans le Système Frontalier Numérique du Rwanda",
    "home.description": "Une plateforme complète et sécurisée pour les demandes de passeport et visa, la gestion des frontières, et l'intégration de bases de données internationales. Connectez-vous pour un accès complet ou continuez comme invité.",
    "home.systemOverview": "Aperçu du Système",
    "home.startApplication": "Commencer une Demande",
    "home.guestAccess": "Accès Invité - Fonctionnalités Limitées",
    "home.signInFullAccess": "Se Connecter pour un Accès Complet",
    "home.getFullAccess": "Obtenir un Accès Complet à Toutes les Fonctionnalités",
    "home.signInBenefits": "Connectez-vous pour suivre vos demandes, accéder à votre tableau de bord et utiliser des fonctionnalités avancées. L'inscription est gratuite et prend moins de 2 minutes.",
    "home.applicationsProcessed": "Demandes Traitées",
    "home.allTime": "Depuis toujours",
    "home.avgProcessingTime": "Temps de Traitement Moyen",
    "home.reductionAchieved": "réduction obtenue",
    "home.borderCrossingsToday": "Passages Frontaliers Aujourd'hui",
    "home.realTimeTracking": "Suivi en temps réel",
    "home.systemUptime": "Disponibilité du Système",
    "home.aboveTarget": "Au-dessus de l'objectif",
    "home.availableServices": "Services Disponibles",
    "home.publicLoginMore": "Public + Connexion pour Plus",
    "home.ombiLaPasi": "Ombi la Pasi",
    "home.submitPassportApplication": "Soumettre une nouvelle demande de passeport en ligne",
    "home.ombiLaVisa": "Ombi la Visa",
    "home.completeVisaApplication": "Compléter la demande de visa avec téléchargement de documents",
    "home.angaliaHali": "Angalia Hali",
    "home.trackApplicationProgress": "Suivre le progrès de votre demande",
    "home.miadi": "Miadi",
    "home.scheduleBiometricEnrollment": "Programmer l'enregistrement biométrique",
    "home.openService": "Ouvrir le Service",
    "home.needHelp": "Besoin d'Aide?",
    "home.supportAvailable": "Notre équipe de support est disponible 24h/24 et 7j/7 pour vous aider avec les demandes, rendez-vous et accès au système. Connectez-vous pour un support personnalisé et une résolution plus rapide.",
    "home.emergency": "Urgence",
    "home.support": "Support",
    "home.onlineChatAvailable": "Chat en Ligne Disponible",

    // Chatbot
    "chatbot.title": "Assistant de Support d'Immigration",
    "chatbot.placeholder": "Tapez votre message...",
    "chatbot.send": "Envoyer",
    "chatbot.close": "Fermer le Chat",
    "chatbot.open": "Ouvrir l'Assistant de Chat",
    "chatbot.greeting": "Bonjour! Je suis votre Assistant de Support d'Immigration. Comment puis-je vous aider aujourd'hui?",
    "chatbot.typing": "L'assistant écrit...",
    "chatbot.quickActions": "Actions Rapides",
    "chatbot.newChat": "Nouveau Chat",
    "chatbot.quickAction.passport": "Demander un Passeport",
    "chatbot.quickAction.visa": "Demander un Visa",
    "chatbot.quickAction.status": "Vérifier le Statut",
    "chatbot.quickAction.appointment": "Prendre Rendez-vous",
    "chatbot.quickAction.requirements": "Exigences Documentaires",
    "chatbot.quickAction.fees": "Frais et Paiement",
    "chatbot.quickAction.processing": "Délais de Traitement",
    "chatbot.quickAction.contact": "Contacter le Support",
    "chatbot.response.passport": "Pour demander un passeport, vous aurez besoin de: Carte d'identité nationale valide, Acte de naissance, Deux photos récentes, Formulaire de demande complété, et frais applicables. Souhaitez-vous commencer votre demande maintenant?",
    "chatbot.response.visa": "Pour les demandes de visa, les exigences varient selon le type de visa et la nationalité. Généralement nécessaire: Passeport valide, Formulaire de visa complété, Photos d'identité, Documents justificatifs, et frais de visa. Quel type de visa vous intéresse?",
    "chatbot.response.status": "Vous pouvez vérifier le statut de votre demande en utilisant votre numéro de référence. Veuillez aller à 'Vérifier le Statut' dans le menu principal ou fournir votre numéro de référence ici.",
    "chatbot.response.appointment": "Pour prendre rendez-vous pour l'enregistrement biométrique, allez à 'Rendez-vous' dans le menu principal. Vous aurez besoin de votre numéro de référence de demande. Besoin d'aide?",
    "chatbot.response.requirements": "Les exigences documentaires varient selon le type de service. Pour Passeport: Carte d'identité nationale, acte de naissance, photos. Pour Visa: Passeport, lettre d'invitation (le cas échéant), documents de voyage, preuve de fonds. De quel service avez-vous besoin?",
    "chatbot.response.fees": "Frais de service: Passeport (Standard - 32 pages): 60 USD ou 60 000 RWF, Passeport (48 pages): 100 USD, Visa (Touriste): 50 USD, Visa (Affaires): 100 USD. Modes de paiement: Mobile money, Virement bancaire, Paiement par carte.",
    "chatbot.response.processing": "Délais de traitement: Passeport (Régulier): 10-15 jours ouvrables, Passeport (Express): 3-5 jours ouvrables, Visa (Touriste): 5-7 jours ouvrables, Visa (Affaires): 7-10 jours ouvrables. Les délais peuvent varier en haute saison.",
    "chatbot.response.contact": "Contactez notre équipe de support: Email: support@immigration.gov.rw, Téléphone: +250 788 123 456, Ligne d'urgence: +250 788 000 911, Heures de bureau: Lundi-Vendredi 8h00 - 17h00. Comment puis-je encore vous aider?",
    "chatbot.error": "Je m'excuse, je n'ai pas bien compris. Pourriez-vous reformuler ou utiliser l'un des boutons d'action rapide?"
  },
  
  sw: {
    // Navigation & General
    "nav.home": "Nyumbani",
    "nav.services": "Huduma",
    "nav.status": "Angalia Hali",
    "nav.appointments": "Miadi",
    "nav.help": "Msaada",
    "nav.profile": "Wasifu",
    "nav.dashboard": "Dashibodi",
    "nav.analytics": "Uchanganuzi",
    "nav.reports": "Ripoti",
    "nav.settings": "Mipangilio",
    "nav.logout": "Toka",
    "nav.login": "Ingia",
    "nav.back": "Rudi",
    "nav.refresh": "Onyesha Upya",
    "nav.breadcrumb": "Njia ya Urambazaji",
    
    // Theme
    "theme.lightMode": "Hali ya Mwangaza",
    "theme.darkMode": "Hali ya Giza",
    "theme.switchToLight": "Badilisha kuwa Hali ya Mwangaza",
    "theme.switchToDark": "Badilisha kuwa Hali ya Giza",
    
    // System
    "system.welcome": "Karibu katika Mfumo wa Usimamizi wa Mipaka na Pasi",
    "system.loading": "Inapakia...",
    "system.error": "Hitilafu ya Mfumo",
    "system.success": "Mafanikio",
    "system.save": "Hifadhi",
    "system.cancel": "Ghairi",
    "system.delete": "Futa",
    "system.edit": "Hariri",
    "system.view": "Ona",
    "system.download": "Pakua",
    "system.upload": "Pakia",
    "system.search": "Tafuta",
    "system.filter": "Chuja",
    "system.sort": "Panga",
    "system.refresh": "Onyesha Upya",
    "system.back": "Rudi",
    "system.next": "Ifuatayo",
    "system.previous": "Iliyotangulia",
    "system.confirm": "Thibitisha",
    "system.submit": "Wasilisha",
    
    // Forms & Fields
    "form.personalInfo": "Taarifa za Kibinafsi",
    "form.firstName": "Jina la Kwanza",
    "form.lastName": "Jina la Ukoo",
    "form.middleName": "Jina la Kati",
    "form.dateOfBirth": "Tarehe ya Kuzaliwa",
    "form.placeOfBirth": "Mahali pa Kuzaliwa",
    "form.nationality": "Uraia",
    "form.gender": "Jinsia",
    "form.maritalStatus": "Hali ya Ndoa",
    "form.phoneNumber": "Nambari ya Simu",
    "form.email": "Barua Pepe",
    "form.address": "Anwani",
    "form.city": "Jiji",
    "form.province": "Mkoa",
    "form.country": "Nchi",
    "form.postalCode": "Msimbo wa Posta",
    "form.nationalId": "Kitambulisho cha Kitaifa",
    "form.passport": "Nambari ya Pasi",
    "form.passportExpiry": "Tarehe ya Kuisha kwa Pasi",
    "form.profession": "Kazi",
    "form.employer": "Mwajiri",
    "form.emergencyContact": "Mawasiliano ya Dharura",
    "form.submit": "Wasilisha Ombi",
    "form.required": "Sehemu inayohitajika",
    "form.optional": "Si lazima",
    "form.select": "Chagua...",
    "form.selectCountry": "Chagua Nchi",
    "form.uploadDocument": "Pakia Hati",
    
    // Applications
    "passport.title": "Ombi la Pasi",
    "passport.new": "Pasi Mpya",
    "passport.renewal": "Upyaji wa Pasi",
    "passport.replacement": "Kubadili Pasi Iliyopotea/Kuibiwa",
    "visa.title": "Ombi la Visa",
    "visa.tourist": "Visa ya Utalii",
    "visa.business": "Visa ya Biashara",
    "visa.transit": "Visa ya Kupita",
    "visa.diplomatic": "Visa ya Kidiplomasia",
    "permit.title": "Ombi la Kibali",
    "permit.work": "Kibali cha Kazi",
    "permit.residence": "Kibali cha Makazi",
    "permit.student": "Kibali cha Mwanafunzi",
    "permit.investment": "Kibali cha Uwekezaji",
    "citizenship.title": "Ombi la Uraia",
    "citizenship.naturalization": "Kupata Uraia",
    "citizenship.birthRegistration": "Usajili wa Kuzaliwa",
    "citizenship.dual": "Uraia Mzuri",
    "cepgl.title": "Ombi la Hati ya CEPGL",
    "laissezPasser.title": "Ombi la Laissez-Passer",
    "refugee.title": "Huduma za Wakimbizi",
    "diaspora.title": "Huduma za Diaspora",
    
    // Status & Progress
    "status.pending": "Inasubiri",
    "status.approved": "Imeidhinishwa",
    "status.rejected": "Imekataliwa",
    "status.processing": "Inachakatwa",
    "status.underReview": "Inakaguliwa",
    "status.documentsRequired": "Hati Zinahitajika",
    "status.interviewScheduled": "Mahojiano Yamepangwa",
    "status.ready": "Tayari Kuchukua",
    "status.collected": "Imechukuliwa",
    
    // Documents
    "document.birth": "Hati ya Kuzaliwa",
    "document.marriage": "Hati ya Ndoa",
    "document.divorce": "Hati ya Talaka",
    "document.education": "Hati ya Elimu",
    "document.medical": "Hati ya Kiafya",
    "document.police": "Hati ya Polisi",
    "document.photo": "Picha ya Pasi",
    "document.proof": "Uthibitisho wa Anwani",
    "document.financial": "Taarifa za Kifedha",
    
    // Biometrics
    "biometric.fingerprint": "Alama za Vidole",
    "biometric.photo": "Picha",
    "biometric.signature": "Sahihi",
    "biometric.capture": "Nasa Biometrics",
    "biometric.verify": "Thibitisha Utambulisho",
    "biometric.quality": "Ubora wa Picha",
    
    // Payments
    "payment.fee": "Ada ya Ombi",
    "payment.processing": "Ada ya Uchakataji",
    "payment.express": "Ada ya Haraka",
    "payment.total": "Jumla ya Kiasi",
    "payment.method": "Njia ya Malipo",
    "payment.card": "Kadi ya Mkopo/Debit",
    "payment.mobile": "Pesa za Simu",
    "payment.bank": "Uhamishaji wa Benki",
    "payment.receipt": "Risiti ya Malipo",
    
    // Messages
    "success.applicationSubmitted": "Ombi limewasilishwa kwa mafanikio",
    "success.paymentProcessed": "Malipo yamechakatwa kwa mafanikio",
    "success.documentUploaded": "Hati imepakiwa kwa mafanikio",
    "success.appointmentBooked": "Miadi imehifadhiwa kwa mafanikio",
    "error.fillRequired": "Tafadhali jaza sehemu zote zinazohitajika",
    "error.invalidFormat": "Muundo si sahihi",
    "error.fileSize": "Ukubwa wa faili ni mkubwa sana",
    "error.networkError": "Hitilafu ya mtandao. Tafadhali jaribu tena",
    "warning.documentExpiring": "Hati yako inakaribia kuisha muda",
    "warning.unsavedChanges": "Una mabadiliko ambayo hayajahifadhiwa",
    "info.processingTime": "Muda wa uchakataji: siku 7-14 za kazi",
    
    // Help & Support
    "help.title": "Msaada na Uongozi",
    "help.faq": "Maswali Yanayoulizwa Mara kwa Mara",
    "help.contact": "Wasiliana na Msaada",
    "help.guides": "Miongozo ya Watumiaji",
    "help.tutorials": "Mafunzo ya Video",
    "help.documentation": "Nyaraka",
    "help.feedback": "Tuma Maoni",
    "help.reportIssue": "Ripoti Tatizo",
    
    // Admin
    "admin.dashboard": "Dashibodi ya Msimamizi",
    "admin.users": "Usimamizi wa Watumiaji",
    "admin.applications": "Usimamizi wa Maombi",
    "admin.reports": "Ripoti na Uchanganuzi",
    "admin.settings": "Mipangilio ya Mfumo",
    "admin.audit": "Kumbukumbu za Ukaguzi",
    "admin.security": "Usalama",
    "admin.backup": "Hifadhi na Kurejesha",
    
    // Additional Navigation & UI
    "nav.about": "Kuhusu",
    "nav.applications": "Maombi",
    "nav.account": "Akaunti",
    "nav.myProfile": "Wasifu Wangu",
    "nav.myApplications": "Maombi Yangu",
    "nav.signIn": "Ingia",
    "nav.signOut": "Toka",
    "nav.register": "Jisajili",
    "nav.signInRegister": "Ingia / Jisajili",
    "nav.accountSettings": "Mipangilio ya Akaunti",
    "nav.contactDirectory": "Orodha ya Mawasiliano",
    
    // User Roles & Account Types
    "role.customer": "Mteja",
    "role.officer": "Afisa",
    "role.admin": "Msimamizi",
    "role.superAdmin": "Msimamizi Mkuu",
    "role.customerAccount": "Akaunti ya Mteja",
    "role.officerAccount": "Akaunti ya Afisa",
    "role.adminAccount": "Akaunti ya Msimamizi",
    
    // Common UI Elements
    "ui.active": "Amilifu",
    "ui.inactive": "Haijamilifi",
    "ui.processing": "Inaendelea",
    "ui.completed": "Imekamilika",
    "ui.online": "Mtandaoni",
    "ui.offline": "Nje ya Mtandao",
    "ui.available": "Inapatikana",
    "ui.unavailable": "Haipatikani",
    "ui.open": "Wazi",
    "ui.closed": "Imefungwa",
    "ui.yes": "Ndiyo",
    "ui.no": "Hapana",
    "ui.all": "Zote",
    "ui.none": "Hakuna",
    "ui.new": "Mpya",
    "ui.recent": "Hivi Karibuni",
    "ui.popular": "Maarufu",
    "ui.featured": "Maalum",
    "ui.recommended": "Inapendekezwa",
    "ui.quickActions": "Vitendo vya Haraka",
    "ui.recentActivity": "Shughuli za Hivi Karibuni",
    "ui.systemStatus": "Hali ya Mfumo",
    "ui.statistics": "Takwimu",
    "ui.overview": "Muhtasari",
    "ui.details": "Maelezo",
    "ui.summary": "Muhtasari",
    "ui.more": "Zaidi",
    "ui.less": "Kidogo",
    "ui.showMore": "Onyesha Zaidi",
    "ui.showLess": "Onyesha Kidogo",
    "ui.expand": "Panua",
    "ui.collapse": "Kunja",
    "ui.minimize": "Punguza",
    "ui.maximize": "Ongeza",
    
    // Service Categories
    "service.digitalPass": "Pasi ya Kidijitali",
    "service.paymentCenter": "Kituo cha Malipo",
    "service.documentUpload": "Kupakia Hati",
    "service.biometricEnrollment": "Uandikishaji wa Biometrics",
    "service.statusTracking": "Kufuatilia Hali",
    "service.appointmentBooking": "Kuagiza Miadi",
    "service.borderControl": "Udhibiti wa Mipaka",
    "service.identityVerification": "Uthibitishaji wa Utambulisho",
    "service.securityServices": "Huduma za Usalama",
    "service.multiAgency": "Huduma za Mashirika Mengi",
    "service.analytics": "Uchanganuzi",
    "service.reporting": "Ripoti",
    "service.userManagement": "Usimamizi wa Watumiaji",
    "service.systemSettings": "Mipangilio ya Mfumo",
    
    // Admin Specific
    "admin.processing": "Uchakataji",
    "admin.borderControl": "Udhibiti wa Mipaka",
    "admin.biometrics": "Biometrics",
    "admin.security": "Usalama",
    "admin.analytics": "Uchanganuzi",
    "admin.management": "Usimamizi",
    "admin.entryExitLogging": "Kuandika Kuingia/Kutoka",
    "admin.travelRecords": "Kumbukumbu za Usafiri",
    "admin.statusVerification": "Uthibitishaji wa Hali",
    "admin.enrollment": "Uandikishaji",
    "admin.verification": "Uthibitishaji",
    "admin.centers": "Vituo",
    "admin.interpol": "INTERPOL",
    "admin.watchlist": "Orodha ya Ufuatiliaji",
    "admin.multiAgency": "Mashirika Mengi",
    "admin.systemMonitoring": "Ufuatiliaji wa Mfumo",
    "admin.auditLogs": "Kumbukumbu za Ukaguzi",
    "admin.backupRestore": "Hifadhi na Kurejesha",
    "admin.configManager": "Msimamizi wa Usanidi",
    
    // System Organization
    "org.rwandaImmigration": "Uhamiaji wa Rwanda",
    "org.digitalServicesPortal": "Mlango wa Huduma za Kidijitali",
    "org.immigrationPortal": "Mlango wa Uhamiaji",
    "org.borderPassportSystem": "Mfumo wa Usimamizi wa Mipaka na Pasi",
    
    // Time & Dates
    "time.today": "Leo",
    "time.yesterday": "Jana",
    "time.thisWeek": "Wiki Hii",
    "time.thisMonth": "Mwezi Huu",
    "time.thisYear": "Mwaka Huu",
    "time.lastWeek": "Wiki Iliyopita",
    "time.lastMonth": "Mwezi Uliopita",
    "time.lastYear": "Mwaka Uliopita",
    "time.businessDays": "siku za kazi",
    "time.workingDays": "siku za utendaji",
    "time.hours": "masaa",
    "time.minutes": "dakika",
    "time.seconds": "sekunde",
    
    // Notifications & Messages
    "notification.welcome": "Karibu kwenye mfumo",
    "notification.loginSuccess": "Kuingia kumefaulu",
    "notification.logoutSuccess": "Kutoka kumefaulu",
    "notification.profileUpdated": "Wasifu umesasishwa kwa mafanikio",
    "notification.settingsSaved": "Mipangilio imehifadhiwa kwa mafanikio",
    "notification.systemMaintenance": "Matengenezo ya mfumo yaendelea",
    "notification.newFeature": "Kipengele kipya kinapatikana",
    "notification.updateAvailable": "Sasishaji la mfumo linapatikana",
    
    // Error Messages
    "error.accessDenied": "Ufikiaji umekataliwa. Huna ruhusa ya kuona ukurasa huu",
    "error.sessionExpired": "Kikao chako kimekwisha. Tafadhali ingia tena",
    "error.serverError": "Hitilafu ya seva imetokea. Tafadhali jaribu baadaye",
    "error.notFound": "Ukurasa haujapatikana",
    "error.maintenance": "Mfumo unatengenezwa. Tafadhali jaribu baadaye",
    
    // Support & Language
    "support.language": "Lugha",
    "support.helpSupport": "Msaada na Uongozi",
    "support.supportLanguage": "Msaada na Lugha",
    
    // Home Page Content
    "home.welcome": "Karibu kwenye Mfumo wa Kidijitali wa Mipaka ya Rwanda",
    "home.description": "Jukwaa kamili na salama la maombi ya pasipoti na visa, usimamizi wa mipaka, na ujumuishaji wa hifadhidata za kimataifa. Ingia kwa ufikiaji kamili au endelea kama mgeni.",
    "home.systemOverview": "Muhtasari wa Mfumo",
    "home.startApplication": "Anza Ombi",
    "home.guestAccess": "Ufikiaji wa Mgeni - Vipengele Vichache",
    "home.signInFullAccess": "Ingia kwa Ufikiaji Kamili",
    "home.getFullAccess": "Pata Ufikiaji Kamili wa Vipengele Vyote",
    "home.signInBenefits": "Ingia ili kufuatilia maombi, kufikia dashibodi yako, na kutumia vipengele vya hali ya juu. Usajili ni bure na huchukua chini ya dakika 2.",
    "home.applicationsProcessed": "Maombi Yaliyochakatwa",
    "home.allTime": "Tangu mwanzo",
    "home.avgProcessingTime": "Muda wa Wastani wa Uchakataji",
    "home.reductionAchieved": "kupunguzwa kumepatikana",
    "home.borderCrossingsToday": "Makovyo ya Mipaka Leo",
    "home.realTimeTracking": "Ufuatiliaji wa wakati halisi",
    "home.systemUptime": "Upatikanaji wa Mfumo",
    "home.aboveTarget": "Juu ya lengo",
    "home.availableServices": "Huduma Zinazopatikana",
    "home.publicLoginMore": "Umma + Ingia kwa Zaidi",
    "home.ombiLaPasi": "Ombi la Pasi",
    "home.submitPassportApplication": "Wasilisha ombi jipya la pasipoti mtandaoni",
    "home.ombiLaVisa": "Ombi la Visa",
    "home.completeVisaApplication": "Kamilisha ombi la visa pamoja na upakiaji wa nyaraka",
    "home.angaliaHali": "Angalia Hali",
    "home.trackApplicationProgress": "Fuatilia maendeleo ya ombi lako",
    "home.miadi": "Miadi",
    "home.scheduleBiometricEnrollment": "Panga usajili wa bayommetrik",
    "home.openService": "Fungua Huduma",
    "home.needHelp": "Unahitaji Msaada?",
    "home.supportAvailable": "Timu yetu ya msaada inapatikana masaa 24/7 kusaidia na maombi, miadi, na ufikiaji wa mfumo. Ingia kwa msaada wa kibinafsi na utatuzi wa haraka.",
    "home.emergency": "Dharura",
    "home.support": "Msaada",
    "home.onlineChatAvailable": "Mazungumzo ya Mtandaoni Yanapatikana",

    // Chatbot
    "chatbot.title": "Msaidizi wa Msaada wa Uhamiaji",
    "chatbot.placeholder": "Andika ujumbe wako...",
    "chatbot.send": "Tuma",
    "chatbot.close": "Funga Mazungumzo",
    "chatbot.open": "Fungua Msaidizi wa Mazungumzo",
    "chatbot.greeting": "Habari! Mimi ni Msaidizi wako wa Msaada wa Uhamiaji. Ninawezaje kukusaidia leo?",
    "chatbot.typing": "Msaidizi anaandika...",
    "chatbot.quickActions": "Vitendo vya Haraka",
    "chatbot.newChat": "Mazungumzo Mapya",
    "chatbot.quickAction.passport": "Omba Pasipoti",
    "chatbot.quickAction.visa": "Omba Visa",
    "chatbot.quickAction.status": "Angalia Hali",
    "chatbot.quickAction.appointment": "Weka Miadi",
    "chatbot.quickAction.requirements": "Mahitaji ya Nyaraka",
    "chatbot.quickAction.fees": "Ada na Malipo",
    "chatbot.quickAction.processing": "Muda wa Uchakataji",
    "chatbot.quickAction.contact": "Wasiliana na Msaada",
    "chatbot.response.passport": "Ili kuomba pasipoti, utahitaji: Kitambulisho halali cha kitaifa, Cheti cha kuzaliwa, Picha mbili za hivi karibuni, Fomu iliyojazwa, na ada zinazotumika. Je, ungependa kuanza ombi lako sasa?",
    "chatbot.response.visa": "Kwa maombi ya visa, mahitaji yanatofautiana kulingana na aina ya visa na uraia. Kwa ujumla inahitajika: Pasipoti halali, Fomu ya visa iliyojazwa, Picha za pasipoti, Nyaraka za msaada, na ada ya visa. Aina gani ya visa unayoipenda?",
    "chatbot.response.status": "Unaweza kuangalia hali ya ombi lako kwa kutumia nambari yako ya kumbukumbu. Tafadhali nenda kwenye 'Angalia Hali' kwenye menyu kuu au toa nambari yako ya kumbukumbu hapa.",
    "chatbot.response.appointment": "Ili kuweka miadi ya usajili wa bayometrik, nenda kwenye 'Miadi' kwenye menyu kuu. Utahitaji nambari yako ya kumbukumbu ya ombi. Unahitaji msaada?",
    "chatbot.response.requirements": "Mahitaji ya nyaraka yanatofautiana kulingana na aina ya huduma. Kwa Pasipoti: Kitambulisho cha kitaifa, cheti cha kuzaliwa, picha. Kwa Visa: Pasipoti, barua ya mwaliko (ikiwa inatumika), nyaraka za safari, uthibitisho wa fedha. Unahitaji huduma gani?",
    "chatbot.response.fees": "Ada za huduma: Pasipoti (Kawaida - kurasa 32): $60 USD au 60,000 RWF, Pasipoti (kurasa 48): $100 USD, Visa (Utalii): $50 USD, Visa (Biashara): $100 USD. Njia za malipo: Pesa ya simu, Uhamisho wa benki, Malipo ya kadi.",
    "chatbot.response.processing": "Muda wa uchakataji: Pasipoti (Kawaida): siku 10-15 za kazi, Pasipoti (Haraka): siku 3-5 za kazi, Visa (Utalii): siku 5-7 za kazi, Visa (Biashara): siku 7-10 za kazi. Muda unaweza kutofautiana wakati wa vipindi vya kilele.",
    "chatbot.response.contact": "Wasiliana na timu yetu ya msaada: Barua pepe: support@immigration.gov.rw, Simu: +250 788 123 456, Mstari wa dharura: +250 788 000 911, Masaa ya ofisi: Jumatatu-Ijumaa 8:00 Asubuhi - 5:00 Jioni. Ninawezaje kukusaidia zaidi?",
    "chatbot.error": "Samahani, sikuelewa vizuri. Je, unaweza kusema tena au kutumia mojawapo ya vitufe vya vitendo vya haraka?"
  },
  

  
  rw: {
    // Navigation & General
    "nav.home": "Ahabanza",
    "nav.services": "Serivisi",
    "nav.status": "Reba Uko Bihagaze",
    "nav.appointments": "Gahunda z'Amasaha",
    "nav.help": "Ubufasha",
    "nav.profile": "Umwirondoro",
    "nav.dashboard": "Ibikubahiriza",
    "nav.analytics": "Isesengura",
    "nav.reports": "Raporo",
    "nav.settings": "Igenamiterere",
    "nav.logout": "Sohoka",
    "nav.login": "Kwinjira",
    "nav.back": "Subira",
    "nav.refresh": "Vugurura",
    "nav.breadcrumb": "Inzira y'Urugendo",
    
    // Theme
    "theme.lightMode": "Uburyo bw'Umucyo",
    "theme.darkMode": "Uburyo bw'Umwijima",
    "theme.switchToLight": "Hindura Uburyo bw'Umucyo",
    "theme.switchToDark": "Hindura Uburyo bw'Umwijima",
    
    // System
    "system.welcome": "Murakaza neza muri Sisitemu y'Ubuyobozi bw'Imipaka n'Amakarita y'Ingendo",
    "system.loading": "Birikwijamo...",
    "system.error": "Ikosa rya Sisitemu",
    "system.success": "Ibyamezwe",
    "system.save": "Bika",
    "system.cancel": "Hagarika",
    "system.delete": "Siba",
    "system.edit": "Hindura",
    "system.view": "Reba",
    "system.download": "Pakurura",
    "system.upload": "Uzana",
    "system.search": "Shakisha",
    "system.filter": "Shuza",
    "system.sort": "Shirisha",
    "system.refresh": "Vugurura",
    "system.back": "Subira",
    "system.next": "Ikurikira",
    "system.previous": "Ibyahise",
    "system.confirm": "Emeza",
    "system.submit": "Kohereza",
    
    // Forms & Fields
    "form.personalInfo": "Amakuru y'Umuntu",
    "form.firstName": "Izina ry'Ambere",
    "form.lastName": "Izina ry'Umuryango",
    "form.middleName": "Izina ryo Hagati",
    "form.dateOfBirth": "Tariki y'Amavuko",
    "form.placeOfBirth": "Ahantu h'Amavuko",
    "form.nationality": "Ubwenegihugu",
    "form.gender": "Igitsina",
    "form.maritalStatus": "Ubusimba",
    "form.phoneNumber": "Nimero ya Terefone",
    "form.email": "Aderesi ya Imeyili",
    "form.address": "Aderesi",
    "form.city": "Umujyi",
    "form.province": "Intara",
    "form.country": "Igihugu",
    "form.postalCode": "Nimero y'Iposita",
    "form.nationalId": "Indangamuntu",
    "form.passport": "Nimero ya Pasiporo",
    "form.passportExpiry": "Tariki yo Kurangira kwa Pasiporo",
    "form.profession": "Umwuga",
    "form.employer": "Mukoresha",
    "form.emergencyContact": "Ukuvugana mu Bihutye",
    "form.submit": "Kohereza Ubusabe",
    "form.required": "Ikigize gisabwa",
    "form.optional": "Ntibishoboka",
    "form.select": "Hitamo...",
    "form.selectCountry": "Hitamo Igihugu",
    "form.uploadDocument": "Uzana Inyandiko",
    
    // Applications
    "passport.title": "Ubusabe bwa Pasiporo",
    "passport.new": "Pasiporo Nshya",
    "passport.renewal": "Gusubiramo Pasiporo",
    "passport.replacement": "Gusimbura Pasiporo Yazimye/Yajijwe",
    "visa.title": "Ubusabe bwa Viza",
    "visa.tourist": "Viza y'Ubukerarugendo",
    "visa.business": "Viza y'Ubucuruzi",
    "visa.transit": "Viza y'Ubunyangamugayo",
    "visa.diplomatic": "Viza ya Diplomatike",
    "permit.title": "Ubusabe bw'Uruhushya",
    "permit.work": "Uruhushya rw'Akazi",
    "permit.residence": "Uruhushya rwo Gutura",
    "permit.student": "Uruhushya rw'Umunyeshuli",
    "permit.investment": "Uruhushya rw'Ishoramari",
    "citizenship.title": "Ubusabe bw'Ubwenegihugu",
    "citizenship.naturalization": "Kubona Ubwenegihugu",
    "citizenship.birthRegistration": "Kwandikisha Amavuko",
    "citizenship.dual": "Ubwenegihugu Bubiri",
    "cepgl.title": "Ubusabe bw'Inyandiko ya CEPGL",
    "laissezPasser.title": "Ubusabe bwa Laissez-Passer",
    "refugee.title": "Serivisi z'Impunzi",
    "diaspora.title": "Serivisi za Diaspora",
    
    // Status & Progress
    "status.pending": "Bitegerejwe",
    "status.approved": "Byemewe",
    "status.rejected": "Byanze",
    "status.processing": "Bikoresha",
    "status.underReview": "Birasuzumwa",
    "status.documentsRequired": "Inyandiko Zisabwa",
    "status.interviewScheduled": "Ikiganiro Cyateganijwe",
    "status.ready": "Byiteguye kwa Gufata",
    "status.collected": "Byafashwe",
    
    // Documents
    "document.birth": "Irangamimerere",
    "document.marriage": "Icyemezo cy'Ubukwe",
    "document.divorce": "Icyemezo cy'Ingaragu",
    "document.education": "Icyemezo cy'Amashuri",
    "document.medical": "Icyemezo cy'Ubuvuzi",
    "document.police": "Icyemezo cy'Abapolisi",
    "document.photo": "Ifoto ya Pasiporo",
    "document.proof": "Icyemezo cy'Aho Uba",
    "document.financial": "Raporo y'Amafaranga",
    
    // Biometrics
    "biometric.fingerprint": "Umunyoboke w'Urutoki",
    "biometric.photo": "Ifoto",
    "biometric.signature": "Umukono",
    "biometric.capture": "Gufata Amakuru y'Umubiri",
    "biometric.verify": "Kwemeza Indangamuntu",
    "biometric.quality": "Ubunyangamugayo bw'Ishusho",
    
    // Payments
    "payment.fee": "Amafaranga y'Ubusabe",
    "payment.processing": "Amafaranga yo Gutunganya",
    "payment.express": "Amafaranga y'Ibyihuta",
    "payment.total": "Umubare w'Amafaranga Yose",
    "payment.method": "Uburyo bwo Kwishyura",
    "payment.card": "Ikarita y'Inguzanyo/Debit",
    "payment.mobile": "Amafaranga ya Telefone",
    "payment.bank": "Kohereza muri Banki",
    "payment.receipt": "Icyemezo cy'Ubwishyu",
    
    // Messages
    "success.applicationSubmitted": "Ubusabe bwohererejwe neza",
    "success.paymentProcessed": "Ubwishyu bwatunganijwe neza",
    "success.documentUploaded": "Inyandiko yuzanwe neza",
    "success.appointmentBooked": "Gahunda y'isaha yateganijwe neza",
    "error.fillRequired": "Nyamuneka uzuza ibikoresho byose bisabwa",
    "error.invalidFormat": "Imiterere itafite icyo ishimba",
    "error.fileSize": "Ubunini bw'idosiye ni bunini cyane",
    "error.networkError": "Ikosa rya reseau. Nyamuneka ugerageze nanone",
    "warning.documentExpiring": "Inyandiko yawe igiye kurangira",
    "warning.unsavedChanges": "Ufite impinduka zitarabikwa",
    "info.processingTime": "Igihe cyo gutunganya: iminsi 7-14 y'akazi",
    
    // Help & Support
    "help.title": "Ubufasha n'Ubuyobozi",
    "help.faq": "Ibibazo Bikunze Kubazwa",
    "help.contact": "Vugana n'Ubufasha",
    "help.guides": "Ibyerekeye Ubukoresha",
    "help.tutorials": "Amahugurwa ya Video",
    "help.documentation": "Inyandiko",
    "help.feedback": "Kohereza Ibitekerezo",
    "help.reportIssue": "Menyesha Ikibazo",
    
    // Admin
    "admin.dashboard": "Ibikubahiriza by'Ubuyobozi",
    "admin.users": "Gucunga Abakoresha",
    "admin.applications": "Gucunga Ubusabe",
    "admin.reports": "Raporo n'Isesengura",
    "admin.settings": "Igenamiterere rya Sisitemu",
    "admin.audit": "Inyandiko z'Igenzura",
    "admin.security": "Umutekano",
    "admin.backup": "Kubika no Kugarura",
    
    // Additional Navigation & UI
    "nav.about": "Kubijanye na",
    "nav.applications": "Ubusabe",
    "nav.account": "Konti",
    "nav.myProfile": "Umwirondoro Wanjye",
    "nav.myApplications": "Ubusabe Bwanjye",
    "nav.signIn": "Kwinjira",
    "nav.signOut": "Sohoka",
    "nav.register": "Kwiyandikisha",
    "nav.signInRegister": "Kwinjira / Kwiyandikisha",
    "nav.accountSettings": "Igenamiterere rya Konti",
    "nav.contactDirectory": "Urutonde rw'Aho Kuvugana",
    
    // User Roles & Account Types
    "role.customer": "Umukiriya",
    "role.officer": "Umukozi",
    "role.admin": "Umucunga",
    "role.superAdmin": "Umucunga Mukuru",
    "role.customerAccount": "Konti y'Umukiriya",
    "role.officerAccount": "Konti y'Umukozi",
    "role.adminAccount": "Konti y'Umucunga",
    
    // Common UI Elements
    "ui.active": "Bikora",
    "ui.inactive": "Ntibikora",
    "ui.processing": "Biracungwa",
    "ui.completed": "Byarangiye",
    "ui.online": "Kuri Interineti",
    "ui.offline": "Ntakuri Interineti",
    "ui.available": "Birahari",
    "ui.unavailable": "Ntibiraboneka",
    "ui.open": "Bifunguye",
    "ui.closed": "Bifunze",
    "ui.yes": "Yego",
    "ui.no": "Oya",
    "ui.all": "Byose",
    "ui.none": "Nta kimwe",
    "ui.new": "Gishya",
    "ui.recent": "Biheruka",
    "ui.popular": "Bizwi cyane",
    "ui.featured": "Bigaragazwa",
    "ui.recommended": "Bigusabwa",
    "ui.quickActions": "Ibikorwa byihuta",
    "ui.recentActivity": "Ibikorwa biheruka",
    "ui.systemStatus": "Uko Sisitemu ihagaze",
    "ui.statistics": "Imibare",
    "ui.overview": "Incamake",
    "ui.details": "Ibisobanuro",
    "ui.summary": "Incamake",
    "ui.more": "Byinshi",
    "ui.less": "Bike",
    "ui.showMore": "Erekana Byinshi",
    "ui.showLess": "Erekana Bike",
    "ui.expand": "Gukuza",
    "ui.collapse": "Gufunga",
    "ui.minimize": "Kugabanya",
    "ui.maximize": "Kwongera",
    
    // Service Categories
    "service.digitalPass": "Icyemezo cya Digitale",
    "service.paymentCenter": "Ikigo cy'Ubwishyu",
    "service.documentUpload": "Gushyira Inyandiko",
    "service.biometricEnrollment": "Kwiyandikisha Amakuru y'Umubiri",
    "service.statusTracking": "Gukurikirana Uko Bihagaze",
    "service.appointmentBooking": "Guteganiza Amasaha",
    "service.borderControl": "Kugenzura Imipaka",
    "service.identityVerification": "Kwemeza Indangamuntu",
    "service.securityServices": "Serivisi z'Umutekano",
    "service.multiAgency": "Serivisi z'Inzego Nyinshi",
    "service.analytics": "Isesengura",
    "service.reporting": "Raporo",
    "service.userManagement": "Gucunga Abakoresha",
    "service.systemSettings": "Igenamiterere rya Sisitemu",
    
    // Admin Specific
    "admin.processing": "Gutunganya",
    "admin.borderControl": "Kugenzura Imipaka",
    "admin.biometrics": "Amakuru y'Umubiri",
    "admin.security": "Umutekano",
    "admin.analytics": "Isesengura",
    "admin.management": "Ubuyobozi",
    "admin.entryExitLogging": "Kwandika Kwinjira/Gusohoka",
    "admin.travelRecords": "Inyandiko z'Urugendo",
    "admin.statusVerification": "Kwemeza Uko Bihagaze",
    "admin.enrollment": "Kwiyandikisha",
    "admin.verification": "Kwemeza",
    "admin.centers": "Ibigo",
    "admin.interpol": "INTERPOL",
    "admin.watchlist": "Urutonde rw'Abakurikiranwa",
    "admin.multiAgency": "Inzego Nyinshi",
    "admin.systemMonitoring": "Gukurikirana Sisitemu",
    "admin.auditLogs": "Inyandiko z'Igenzura",
    "admin.backupRestore": "Kubika no Kugarura",
    "admin.configManager": "Gucunga Igenamiterere",
    
    // System Organization
    "org.rwandaImmigration": "Ubuyinjiza mu Rwanda",
    "org.digitalServicesPortal": "Urubuga rw'Amaserivisi ya Digitale",
    "org.immigrationPortal": "Urubuga rw'Ubuyinjiza",
    "org.borderPassportSystem": "Sisitemu y'Ubuyobozi bw'Imipaka n'Amakarita y'Ingendo",
    
    // Time & Dates
    "time.today": "Uyu munsi",
    "time.yesterday": "Ejo",
    "time.thisWeek": "Iki cyumweru",
    "time.thisMonth": "Uku kwezi",
    "time.thisYear": "Uyu mwaka",
    "time.lastWeek": "Icyumweru gishize",
    "time.lastMonth": "Ukwezi gushize",
    "time.lastYear": "Umwaka ushize",
    "time.businessDays": "iminsi y'akazi",
    "time.workingDays": "iminsi yo gukora",
    "time.hours": "amasaha",
    "time.minutes": "iminota",
    "time.seconds": "amasegonda",
    
    // Notifications & Messages
    "notification.welcome": "Murakaza neza muri sisitemu",
    "notification.loginSuccess": "Kwinjira byagenze neza",
    "notification.logoutSuccess": "Gusohoka byagenze neza",
    "notification.profileUpdated": "Umwirondoro wavuguruwe neza",
    "notification.settingsSaved": "Igenamiterere ryabitswe neza",
    "notification.systemMaintenance": "Sisitemu irimo gusanwa",
    "notification.newFeature": "Ibintu bishya biraboneka",
    "notification.updateAvailable": "Kuvugurura sisitemu biraboneka",
    
    // Error Messages
    "error.accessDenied": "Kwinjira byanze. Ntufite uburenganzira bwo kureba uyu rupapuro",
    "error.sessionExpired": "Igihe cyawe cyarangiye. Nyamuneka winjire ukundi",
    "error.serverError": "Ikosa rya seriveri ryabaye. Nyamuneka ugerageze nyuma",
    "error.notFound": "Urupapuro ntiruboneka",
    "error.maintenance": "Sisitemu irimo gusanwa. Nyamuneka ugerageze nyuma",
    
    // Support & Language
    "support.language": "Ururimi",
    "support.helpSupport": "Ubufasha n'Ubuyobozi",
    "support.supportLanguage": "Ubufasha n'Ururimi",
    
    // Home Page Content
    "home.welcome": "Murakaza neza muri Sisitemu ya Dijitale y'Imipaka y'u Rwanda",
    "home.description": "Urubuga ruzuye kandi rutekanye rw'ubusabe bwa pasiporo na viza, ubuyobozi bw'imipaka, n'ubwiyunge bw'ikusanyirizo ry'amakuru mpuzamahanga. Injira kugira ngo ubone byose cyangwa komeza nk'umushyitsi.",
    "home.systemOverview": "Incamake ya Sisitemu",
    "home.startApplication": "Tangira Ubusabe",
    "home.guestAccess": "Kwinjira nk'Umushyitsi - Ibyiza Bike",
    "home.signInFullAccess": "Injira Kugira ngo Ubone Byose",
    "home.getFullAccess": "Bona Ibyiza Byose Bifite",
    "home.signInBenefits": "Injira kugira ngo ukurikirane ubusabe bwawe, ubone ibikubahiriza byawe, kandi ukoreshe ibyiza byinshi. Kwiyandikisha ni ubuntu kandi bimara iminota iri munsi ya 2.",
    "home.applicationsProcessed": "Ubusabe Bwatunganijwe",
    "home.allTime": "Kuva mu matangiriro",
    "home.avgProcessingTime": "Igihe cy'Ikizitira cyo Gutunganya",
    "home.reductionAchieved": "kugabanya kwageragejwe",
    "home.borderCrossingsToday": "Guca Imipaka Uyu Munsi",
    "home.realTimeTracking": "Gukurikirana mu gihe nyacyo",
    "home.systemUptime": "Igihe Sisitemu Ikora",
    "home.aboveTarget": "Hejuru y'intego",
    "home.availableServices": "Serivisi Ziraboneka",
    "home.publicLoginMore": "Rusange + Injira kugira ngo Ubone Byinshi",
    "home.ombiLaPasi": "Ombi la Pasi",
    "home.submitPassportApplication": "Kohereza ubusabe bushya bwa pasiporo kuri interineti",
    "home.ombiLaVisa": "Ombi la Visa",
    "home.completeVisaApplication": "Uzuza ubusabe bwa viza hamwe no kohereza inyandiko",
    "home.angaliaHali": "Angalia Hali",
    "home.trackApplicationProgress": "Kurikirana aho ubusabe bwawe bugeze",
    "home.miadi": "Miadi",
    "home.scheduleBiometricEnrollment": "Teganiza kwiyandikisha amakuru y'umubiri",
    "home.openService": "Fungura Serivisi",
    "home.needHelp": "Ukeneye Ubufasha?",
    "home.supportAvailable": "Itsinda ryacu ry'ubufasha rihari igihe cyose ku munsi na mu ijoro kugira ngo rikugire icyo rikugufasha mu busabe, mu gahunda z'amasaha, no kwinjira muri sisitemu. Injira kugira ngo ubone ubufasha bwihariye no gukemura byihuse.",
    "home.emergency": "Ibihutye",
    "home.support": "Ubufasha",
    "home.onlineChatAvailable": "Ibiganiro bya Interineti Biraboneka",

    // Chatbot
    "chatbot.title": "Umufasha w'Ubufasha bw'Ubukerarugendo",
    "chatbot.placeholder": "Andika ubutumwa bwawe...",
    "chatbot.send": "Ohereza",
    "chatbot.close": "Funga Ibiganiro",
    "chatbot.open": "Fungura Umufasha w'Ibiganiro",
    "chatbot.greeting": "Muraho! Ndi Umufasha wawe w'Ubufasha bw'Ubukerarugendo. Nakugufasha gute uyu munsi?",
    "chatbot.typing": "Umufasha arimo kwandika...",
    "chatbot.quickActions": "Ibikorwa Byihuse",
    "chatbot.newChat": "Ibiganiro Bishya",
    "chatbot.quickAction.passport": "Saba Pasiporo",
    "chatbot.quickAction.visa": "Saba Viza",
    "chatbot.quickAction.status": "Reba Uko Bigeze",
    "chatbot.quickAction.appointment": "Teganiza Gahunda",
    "chatbot.quickAction.requirements": "Ibikenewe by'Inyandiko",
    "chatbot.quickAction.fees": "Amafaranga n'Ubwishyu",
    "chatbot.quickAction.processing": "Igihe cyo Gutunganya",
    "chatbot.quickAction.contact": "Vugana n'Ubufasha",
    "chatbot.response.passport": "Kugira ngo usabe pasiporo, uzakeneye: Indangamuntu y'igihugu ifite agaciro, Icyangombwa cy'ivuka, Amafoto abiri akurikije ibirebwa, Ifishi yuzuye, n'amafaranga akwiye. Wifuza gutangira ubusabe bwawe ubu?",
    "chatbot.response.visa": "Ku busabe bwa viza, ibikenewe biratandukanye ukurikije ubwoko bwa viza n'ubwenegihugu. Muri rusange birakenewe: Pasiporo ifite agaciro, Ifishi ya viza yuzuye, Amafoto ya pasiporo, Inyandiko z'inkunga, n'amafaranga ya viza. Ni ubuhe bwoko bwa viza ushaka?",
    "chatbot.response.status": "Urashobora kureba uko ubusabe bwawe bugeze ukoresheje nomero yawe y'ububiko. Nyamuneka jya kuri 'Reba Uko Bigeze' muri menu nkuru cyangwa utange nomero yawe y'ububiko hano.",
    "chatbot.response.appointment": "Kugira ngo uteganize gahunda y'iyandikisha ry'amakuru y'umubiri, jya kuri 'Amasaha' muri menu nkuru. Uzakeneye nomero yawe y'ububiko bw'ubusabe. Ukeneye ubufasha?",
    "chatbot.response.requirements": "Ibikenewe by'inyandiko biratandukanye ukurikije ubwoko bwa serivisi. Ku Pasiporo: Indangamuntu y'igihugu, icyangombwa cy'ivuka, amafoto. Ku Viza: Pasiporo, ibaruwa y'ubutumire (niba ibaye), inyandiko z'urugendo, ikimenyetso cy'amafaranga. Ni iyihe serivisi ukeneye?",
    "chatbot.response.fees": "Amafaranga ya serivisi: Pasiporo (Isanzwe - impapuro 32): $60 USD cyangwa 60,000 RWF, Pasiporo (impapuro 48): $100 USD, Viza (Umukerarugendo): $50 USD, Viza (Ubucuruzi): $100 USD. Uburyo bwo kwishyura: Amafaranga ya telefoni, Kohereza muri banki, Kwishyura ukoresheje ikarita.",
    "chatbot.response.processing": "Igihe cyo gutunganya: Pasiporo (Isanzwe): iminsi 10-15 y'akazi, Pasiporo (Byihuse): iminsi 3-5 y'akazi, Viza (Umukerarugendo): iminsi 5-7 y'akazi, Viza (Ubucuruzi): iminsi 7-10 y'akazi. Igihe gishobora gutandukana mu gihe cy'ihiganwa.",
    "chatbot.response.contact": "Vugana n'itsinda ryacu ry'ubufasha: Imeli: support@immigration.gov.rw, Telefoni: +250 788 123 456, Umurongo w'ibihutye: +250 788 000 911, Amasaha y'ibiro: Ku wa mbere-Ku wa gatanu 8:00 AM - 5:00 PM. Nakugufasha gute?",
    "chatbot.error": "Mbabarira, sinumvise neza ibyo uvuze. Urashobora kongera ukavuga cyangwa ukoreshe bumwe mu bitutu by'ibikorwa byihuse?"
  }
};

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    // Get saved language from localStorage or default to English
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  const translate = useCallback((key: string, fallback?: string): string => {
    const translation = TRANSLATIONS[currentLanguage]?.[key];
    return translation || fallback || key;
  }, [currentLanguage]);

  const setLanguage = useCallback((language: string) => {
    if (language === currentLanguage) return; // Prevent unnecessary updates
    
    setCurrentLanguage(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      
      // Apply Google Translate if available (disabled for now to prevent issues)
      // Uncomment when Google Translate integration is needed
      /*
      const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === language);
      if (selectedLang && selectedLang.googleTranslateCode !== 'en') {
        applyGoogleTranslate(selectedLang.googleTranslateCode);
      } else {
        removeGoogleTranslate();
      }
      */
    }
  }, [currentLanguage]);

  const value = useMemo(() => ({
    currentLanguage,
    translate,
    setLanguage
  }), [currentLanguage, translate, setLanguage]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Google Translate integration functions
function applyGoogleTranslate(targetLanguage: string) {
  if (typeof window === 'undefined') return;

  // Check if script already exists to prevent duplicates
  const existingScript = document.querySelector('script[src*="translate.google.com/translate_a/element.js"]');
  if (existingScript) {
    // If script exists, just change the language
    setTimeout(() => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = targetLanguage;
        selectElement.dispatchEvent(new Event('change'));
      }
    }, 500);
    return;
  }

  // Remove existing Google Translate
  removeGoogleTranslate();

  // Add Google Translate script
  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.head.appendChild(script);

  // Initialize Google Translate
  (window as any).googleTranslateElementInit = function() {
    if ((window as any).google && (window as any).google.translate) {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,fr,sw,rw',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');

      // Auto-select the target language
      setTimeout(() => {
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = targetLanguage;
          selectElement.dispatchEvent(new Event('change'));
        }
      }, 1000);
    }
  };

  // Add Google Translate container if it doesn't exist
  if (!document.getElementById('google_translate_element')) {
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none';
    document.body.appendChild(container);
  }
}

function removeGoogleTranslate() {
  if (typeof window === 'undefined') return;

  // Remove Google Translate scripts and elements
  const scripts = document.querySelectorAll('script[src*="translate.google"]');
  scripts.forEach(script => script.remove());

  const frames = document.querySelectorAll('iframe[src*="translate.google"]');
  frames.forEach(frame => frame.remove());

  const elements = document.querySelectorAll('.goog-te-banner-frame, .goog-te-ftab, .goog-te-balloon');
  elements.forEach(element => element.remove());

  // Reset body top margin that Google Translate adds
  document.body.style.top = '';
  document.body.style.marginTop = '';

  // Clear the translate element
  const translateElement = document.getElementById('google_translate_element');
  if (translateElement) {
    translateElement.innerHTML = '';
  }

  // Remove translate classes
  document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
  document.body.classList.remove('translated-ltr', 'translated-rtl');
}

// Helper component for translatable text
interface TProps {
  children: string;
  fallback?: string;
}

export function T({ children, fallback }: TProps) {
  const { translate } = useTranslation();
  return <>{translate(children, fallback)}</>;
}

export { SUPPORTED_LANGUAGES };
export type { Language };