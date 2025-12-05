import { Button } from "../ui/button";
import { useAuth } from "../UserAuth";
import { useTranslationWithParams } from "./TranslationUtils";
import { 
  Home, 
  ArrowLeft, 
  ChevronRight,
  RotateCcw 
} from "lucide-react";

interface NavigationUtilsProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  showBreadcrumbs?: boolean;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  customBackAction?: () => void;
  className?: string;
}

interface PageInfo {
  id: string;
  title: string;
  parent?: string;
  icon?: React.ReactNode;
  adminOnly?: boolean;
  officerOnly?: boolean;
}

export function NavigationUtils({ 
  currentPage, 
  onPageChange, 
  showBreadcrumbs = true,
  showBackButton = true,
  showHomeButton = true,
  customBackAction,
  className = ""
}: NavigationUtilsProps) {
  const { isAuthenticated, isCustomer, isOfficer, isAdmin, isSuperAdmin } = useAuth();
  const { t } = useTranslationWithParams();

  // Determine if user is admin-level
  const isAdminUser = isOfficer || isAdmin || isSuperAdmin;

  // Page hierarchy and information
  const getPageHierarchy = (): PageInfo[] => [
    // Public/Customer Pages
    { id: 'home', title: t('nav.home'), icon: <Home className="h-3 w-3" /> },
    { id: 'overview', title: t('nav.about'), parent: 'home' },
    { id: 'services', title: t('nav.services'), parent: 'home' },
    { id: 'help', title: t('nav.help'), parent: 'home' },
    
    // Applications
    { id: 'apply-passport', title: t('passport.title'), parent: 'home' },
    { id: 'apply-visa', title: t('visa.title'), parent: 'home' },
    { id: 'apply-permit', title: t('permit.title'), parent: 'home' },
    { id: 'apply-citizenship', title: t('citizenship.title'), parent: 'home' },
    { id: 'cepgl-service', title: t('cepgl.title'), parent: 'home' },
    { id: 'laissez-passer', title: t('laissezPasser.title'), parent: 'home' },
    { id: 'refugee-services', title: t('refugee.title'), parent: 'home' },
    { id: 'diaspora-services', title: t('diaspora.title'), parent: 'home' },

    // Support Services
    { id: 'appointments', title: t('nav.appointments'), parent: 'home' },
    { id: 'documents', title: t('service.documentUpload'), parent: 'home' },
    { id: 'payments', title: t('service.paymentCenter'), parent: 'home' },
    { id: 'status', title: t('nav.status'), parent: 'home' },
    { id: 'border-pass', title: t('service.digitalPass'), parent: 'home' },

    // Officer Pages
    { id: 'records', title: t('admin.travelRecords'), parent: 'home', officerOnly: true },
    { id: 'entry-exit', title: t('admin.entryExitLogging'), parent: 'home', officerOnly: true },
    { id: 'enroll-biometrics', title: t('admin.enrollment'), parent: 'home', officerOnly: true },
    { id: 'verify-identity', title: t('admin.verification'), parent: 'home', officerOnly: true },
    { id: 'biometric-centers', title: t('admin.centers'), parent: 'home', officerOnly: true },
    { id: 'traveler-dashboard', title: t('admin.travelerDashboard'), parent: 'home', officerOnly: true },
    { id: 'passenger-info', title: t('admin.passengerInfo'), parent: 'home', officerOnly: true },
    { id: 'pre-arrival', title: t('admin.preArrival'), parent: 'home', officerOnly: true },
    { id: 'content-management', title: t('admin.contentManagement'), parent: 'home', officerOnly: true },

    // Admin Pages
    { id: 'admin-dashboard', title: t('admin.management'), parent: 'home', adminOnly: true },
    { id: 'analytics', title: t('admin.analytics'), parent: 'home', adminOnly: true },
    { id: 'alerts', title: t('admin.watchlist'), parent: 'home', adminOnly: true },
    { id: 'agencies', title: t('admin.multiAgency'), parent: 'home', adminOnly: true },
    { id: 'interpol', title: t('admin.interpol'), parent: 'home', adminOnly: true },
    { id: 'secure-chip', title: t('admin.secureChip'), parent: 'home', adminOnly: true },
    { id: 'risk-assessment', title: t('admin.riskAssessment'), parent: 'home', adminOnly: true },
  ];

  const pageHierarchy = getPageHierarchy();

  // Get the appropriate home page based on user role
  const getHomePage = (): string => {
    return 'home'; // Always return 'home' as the main routing logic handles role-based home pages
  };

  // Get page information
  const getPageInfo = (pageId: string): PageInfo | undefined => {
    return pageHierarchy.find(page => page.id === pageId);
  };

  // Build breadcrumb trail
  const getBreadcrumbs = (pageId: string): PageInfo[] => {
    const breadcrumbs: PageInfo[] = [];
    let currentPageInfo = getPageInfo(pageId);
    
    while (currentPageInfo) {
      breadcrumbs.unshift(currentPageInfo);
      if (currentPageInfo.parent) {
        currentPageInfo = getPageInfo(currentPageInfo.parent);
      } else {
        break;
      }
    }
    
    return breadcrumbs;
  };

  // Get parent page for back navigation
  const getParentPage = (pageId: string): string => {
    const pageInfo = getPageInfo(pageId);
    return pageInfo?.parent || getHomePage();
  };

  // Handle back navigation
  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      const parentPage = getParentPage(currentPage);
      onPageChange(parentPage);
    }
  };

  // Handle home navigation
  const handleHome = () => {
    onPageChange(getHomePage());
  };

  // Check if we should show navigation (not on home page)
  const shouldShowNavigation = currentPage !== 'home' && currentPage !== 'login';

  if (!shouldShowNavigation) {
    return null;
  }

  const breadcrumbs = getBreadcrumbs(currentPage);
  const currentPageInfo = getPageInfo(currentPage);

  return (
    <div className={`flex items-center justify-between py-3 px-4 bg-background border-b border-border ${className}`}>
      {/* Left side - Back button and breadcrumbs */}
      <div className="flex items-center space-x-4">
        {/* Back Button */}
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={`flex items-center space-x-2 ${
              isAdminUser 
                ? 'text-admin-text-primary hover:bg-admin-bg-secondary' 
                : 'text-navy-dark hover:bg-blue-lightest'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t('nav.back', {}, 'Back')}</span>
          </Button>
        )}

        {/* Breadcrumbs */}
        {showBreadcrumbs && breadcrumbs.length > 1 && (
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((page, index) => (
              <div key={page.id} className="flex items-center space-x-2">
                {index > 0 && (
                  <ChevronRight className={`h-3 w-3 ${
                    isAdminUser ? 'text-admin-text-secondary' : 'text-navy-medium'
                  }`} />
                )}
                <button
                  onClick={() => onPageChange(page.id)}
                  className={`flex items-center space-x-1 hover:underline ${
                    index === breadcrumbs.length - 1
                      ? isAdminUser 
                        ? 'text-admin-text-primary font-medium' 
                        : 'text-navy-dark font-medium'
                      : isAdminUser 
                        ? 'text-admin-text-secondary hover:text-admin-text-primary' 
                        : 'text-navy-medium hover:text-navy-dark'
                  }`}
                >
                  {page.icon}
                  <span className="hidden md:inline">{page.title}</span>
                </button>
              </div>
            ))}
          </nav>
        )}

        {/* Current page title for mobile */}
        <div className="md:hidden">
          <h2 className={`font-medium ${
            isAdminUser ? 'text-admin-text-primary' : 'text-navy-dark'
          }`}>
            {currentPageInfo?.title}
          </h2>
        </div>
      </div>

      {/* Right side - Home and refresh buttons */}
      <div className="flex items-center space-x-2">
        {/* Refresh current page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
          className={`${
            isAdminUser 
              ? 'text-admin-text-secondary hover:bg-admin-bg-secondary' 
              : 'text-navy-medium hover:bg-blue-lightest'
          }`}
          title={t('nav.refresh', {}, 'Refresh')}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* Home Button */}
        {showHomeButton && currentPage !== 'home' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHome}
            className={`flex items-center space-x-2 ${
              isAdminUser 
                ? 'text-admin-text-primary hover:bg-admin-bg-secondary' 
                : 'text-navy-dark hover:bg-blue-lightest'
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">{t('nav.home', {}, 'Home')}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

// Hook for programmatic navigation
export function useNavigation() {
  const { isAuthenticated, isCustomer, isOfficer, isAdmin, isSuperAdmin } = useAuth();
  
  const getHomePage = () => 'home';
  
  const canAccessPage = (pageId: string): boolean => {
    const publicPages = [
      'home', 'overview', 'apply-passport', 'apply-visa', 'apply-permit', 
      'apply-citizenship', 'cepgl-service', 'laissez-passer', 'refugee-services', 'diaspora-services',
      'appointments', 'documents', 'payments', 'status', 'services', 'help', 'login'
    ];
    
    const customerPages = [...publicPages, 'border-pass'];
    const officerPages = [
      ...customerPages, 'records', 'entry-exit', 'enroll-biometrics', 
      'verify-identity', 'biometric-centers', 'traveler-dashboard', 
      'passenger-info', 'pre-arrival', 'content-management'
    ];
    const adminPages = [
      ...officerPages, 'admin-dashboard', 'analytics', 'alerts', 
      'agencies', 'interpol', 'secure-chip', 'risk-assessment'
    ];
    const superAdminPages = [...adminPages, 'user-management'];

    if (!isAuthenticated) return publicPages.includes(pageId);
    if (isSuperAdmin) return superAdminPages.includes(pageId);
    if (isAdmin) return adminPages.includes(pageId);
    if (isOfficer) return officerPages.includes(pageId);
    if (isCustomer) return customerPages.includes(pageId);
    
    return publicPages.includes(pageId);
  };

  return {
    getHomePage,
    canAccessPage,
    isAdminUser: isOfficer || isAdmin || isSuperAdmin
  };
}

// Quick navigation buttons component
interface QuickNavigationProps {
  onPageChange: (page: string) => void;
  className?: string;
}

export function QuickNavigation({ onPageChange, className = "" }: QuickNavigationProps) {
  const { isAuthenticated, isOfficer, isAdmin, isSuperAdmin } = useAuth();
  const { t } = useTranslationWithParams();
  
  const isAdminUser = isOfficer || isAdmin || isSuperAdmin;

  const quickNavItems = isAdminUser ? [
    { id: 'home', label: t('admin.dashboard'), icon: <Home className="h-4 w-4" /> },
    { id: 'analytics', label: t('admin.analytics'), icon: <Home className="h-4 w-4" /> },
    { id: 'records', label: t('admin.travelRecords'), icon: <Home className="h-4 w-4" /> },
  ] : [
    { id: 'home', label: t('nav.home'), icon: <Home className="h-4 w-4" /> },
    { id: 'apply-passport', label: t('passport.title'), icon: <Home className="h-4 w-4" /> },
    { id: 'status', label: t('nav.status'), icon: <Home className="h-4 w-4" /> },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {quickNavItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(item.id)}
          className={`flex items-center space-x-1 ${
            isAdminUser 
              ? 'text-admin-text-secondary hover:bg-admin-bg-secondary' 
              : 'text-navy-medium hover:bg-blue-lightest'
          }`}
        >
          {item.icon}
          <span className="hidden lg:inline">{item.label}</span>
        </Button>
      ))}
    </div>
  );
}