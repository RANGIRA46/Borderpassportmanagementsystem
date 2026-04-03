import { useState, useEffect } from "react";
import { AuthProvider, useAuth, AuthPage } from "./components/UserAuth";
import { DataInitializer } from "./components/utils/DataInitializer";
import { TranslationProvider } from "./components/utils/LanguageSelector";
import { ThemeProvider } from "./components/utils/ThemeProvider";
import { Navigation } from "./components/Navigation";
import { AdminNavigation } from "./components/AdminNavigation";
import { ProjectOverview } from "./components/ProjectOverview";
import { HomePage } from "./components/HomePage";
import { AdminHomePage } from "./components/AdminHomePage";
import { StatusChecker } from "./components/StatusChecker";
import { BorderRecords } from "./components/BorderRecords";
import { AdminPanel } from "./components/AdminPanel";
import { BiometricEnrollment } from "./components/BiometricEnrollment";
import { DigitalBorderPass } from "./components/DigitalBorderPass";
import { EnhancedAnalyticsDashboard } from "./components/EnhancedAnalyticsDashboard";
import { PaymentCenter } from "./components/PaymentCenter";
import { EntryExitLogging } from "./components/EntryExitLogging";
import { InterpolIntegration } from "./components/InterpolIntegration";
import { IdentityVerification } from "./components/IdentityVerification";
import { BiometricCenters } from "./components/BiometricCenters";
import { AlertsWatchlist } from "./components/AlertsWatchlist";
import { MultiAgencyAccess } from "./components/MultiAgencyAccess";
import { DGIEServices } from "./components/DGIEServices";
import { HelpSystem } from "./components/HelpSystem";
import { SecureChipData } from "./components/SecureChipData";
import { AdvancedPassengerInfo } from "./components/AdvancedPassengerInfo";
import { TravelerDashboard } from "./components/TravelerDashboard";
import { RiskAssessment } from "./components/RiskAssessment";
import { PreArrivalData } from "./components/PreArrivalData";
import { ContentBulletinManagement } from "./components/ContentBulletinManagement";
import { Chatbot } from "./components/Chatbot";
import { PreferencesPanel } from "./components/PreferencesPanel";
import { ModernHomePage } from "./components/ModernHomePage";
import { ModernStatusChecker } from "./components/ModernStatusChecker";
import { FloatingLanguageSwitcher } from "./components/modern/FloatingLanguageSwitcher";

// Professional Components
import { ProfessionalNavigation } from "./components/professional/ProfessionalNavigation";
import { OfficerDashboard } from "./components/professional/OfficerDashboard";
import { ProfessionalAdminDashboard } from "./components/professional/ProfessionalAdminDashboard";
import { ProfessionalStatusTracker } from "./components/professional/ProfessionalStatusTracker";
import { Alert, AlertDescription } from "./components/ui/alert";
import { NavigationUtils } from "./components/utils/NavigationUtils";
import { Toaster } from "./components/ui/sonner";
import { Shield, Lock } from "lucide-react";

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['home']);
  const { isAuthenticated, isCustomer, isOfficer, isAdmin, isSuperAdmin } = useAuth();

  // Update navigation history when page changes
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setNavigationHistory((prev) => [...prev, page]);
  };

  // Go back in navigation history
  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1] || 'home';
      setNavigationHistory(newHistory);
      setCurrentPage(previousPage);
    } else {
      setCurrentPage('home');
    }
  };

  // Determine if user is admin-level (officer, admin, or super-admin)
  const isAdminUser = isOfficer || isAdmin || isSuperAdmin;

  // Define access control for different pages
  const getPageAccess = (page: string) => {
    const publicPages = [
      'home', 'overview', 'border-pass', 'payments', 'status', 'services', 'help', 'login', 'preferences'
    ];
    
    const customerPages = [
      ...publicPages
    ];
    
    const officerPages = [
      ...customerPages, 'records', 'entry-exit', 'enroll-biometrics', 
      'verify-identity', 'biometric-centers', 'traveler-dashboard', 
      'passenger-info', 'pre-arrival', 'content-management'
    ];
    
    const adminPages = [
      ...officerPages, 'admin-dashboard', 'analytics', 'alerts', 
      'agencies', 'interpol', 'secure-chip', 'risk-assessment'
    ];
    
    const superAdminPages = [
      ...adminPages, 'user-management'
    ];

    // Check access based on user role
    if (!isAuthenticated) return publicPages.includes(page);
    if (isSuperAdmin) return superAdminPages.includes(page);
    if (isAdmin) return adminPages.includes(page);
    if (isOfficer) return officerPages.includes(page);
    if (isCustomer) return customerPages.includes(page);
    
    return publicPages.includes(page);
  };

  const renderPage = () => {
    // Show login page
    if (currentPage === 'login') {
      return <AuthPage onPageChange={handlePageChange} />;
    }

    // Check page access
    if (!getPageAccess(currentPage)) {
      return (
        <div className="max-w-4xl mx-auto p-6 mt-8">
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Access denied. You don't have permission to view this page.</span>
              <button 
                onClick={() => handlePageChange('login')}
                className="ml-4 px-3 py-1 bg-navy-medium text-white rounded text-sm hover:bg-navy-dark"
              >
                Sign In
              </button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        // Different home pages for admin vs customer users - Use Modern UI for customers
        return isAdminUser ? 
          <AdminHomePage onPageChange={handlePageChange} /> : 
          <ModernHomePage onPageChange={handlePageChange} />;
      case 'overview':
        return <ProjectOverview />;
      
      // Digital Passport Services
      case 'border-pass':
        return <DigitalBorderPass />;
      case 'payments':
        return <PaymentCenter />;
      case 'status':
        return <ModernStatusChecker />;
      case 'services':
        return <DGIEServices onPageChange={handlePageChange} />;
      case 'help':
        return <HelpSystem />;
      case 'preferences':
        return <PreferencesPanel />;
      
      // Border Services (Officer+ access)
      case 'records':
        return <BorderRecords />;
      case 'entry-exit':
        return <EntryExitLogging />;
      case 'interpol':
        return <InterpolIntegration />;
      
      // Biometrics (Officer+ access)
      case 'enroll-biometrics':
        return <BiometricEnrollment />;
      case 'verify-identity':
        return <IdentityVerification />;
      case 'biometric-centers':
        return <BiometricCenters />;
      
      // Officer Features
      case 'traveler-dashboard':
        return <TravelerDashboard />;
      case 'passenger-info':
        return <AdvancedPassengerInfo />;
      case 'pre-arrival':
        return <PreArrivalData />;
      case 'content-management':
        return <ContentBulletinManagement />;
      
      // Administration (Admin+ access)
      case 'admin-dashboard':
        return <AdminPanel />;
      case 'analytics':
        return <EnhancedAnalyticsDashboard />;
      case 'alerts':
        return <AlertsWatchlist />;
      case 'agencies':
        return <MultiAgencyAccess />;
      case 'secure-chip':
        return <SecureChipData />;
      case 'risk-assessment':
        return <RiskAssessment />;
      
      default:
        return isAdminUser ? 
          <AdminHomePage onPageChange={handlePageChange} /> : 
          <ModernHomePage onPageChange={handlePageChange} />;
    }
  };

  const getThemeClasses = () => {
    if (currentPage === 'login') return 'app-shell customer-theme';
    return isAdminUser ? 'app-shell admin-theme' : 'app-shell customer-theme';
  };

  return (
    <div className={getThemeClasses()}>
      {currentPage !== 'login' && (
        <>
          {isAdminUser ? (
            <AdminNavigation currentPage={currentPage} onPageChange={handlePageChange} />
          ) : (
            <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
          )}
        </>
      )}
      
      {/* Universal Navigation Utils - Back/Home buttons and breadcrumbs */}
      {currentPage !== 'login' && (
        <NavigationUtils
          currentPage={currentPage}
          onPageChange={handlePageChange}
          customBackAction={handleGoBack}
          className={isAdminUser ? 'bg-admin-bg-primary' : 'bg-white'}
        />
      )}

      <main className={currentPage !== 'login' ? "app-main pb-8" : "app-main"}>
        <div className="app-content-shell" style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          {renderPage()}
        </div>
      </main>

      {/* Floating Language Switcher - Only for customer/public users */}
      {currentPage !== 'login' && !isAdminUser && <FloatingLanguageSwitcher />}

      {/* Chatbot - Available on all pages except login */}
      {currentPage !== 'login' && <Chatbot />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TranslationProvider>
          <DataInitializer>
            <AppContent />
            <Toaster position="top-right" richColors closeButton />
          </DataInitializer>
        </TranslationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
