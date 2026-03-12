import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "./ui/dropdown-menu";
import { useAuth } from "./UserAuth";
import { LanguageSelector, useTranslation, Language } from "./utils/LanguageSelector";
import { useTranslationWithParams } from "./utils/TranslationUtils";
import { ThemeToggle } from "./utils/ThemeProvider";
import { 
  User, 
  LogOut, 
  Settings, 
  Menu,
  Shield,
  Globe,
  Bell,
  Search,
  Activity,
  Database,
  Users,
  BarChart3,
  AlertTriangle,
  Fingerprint,
  FileText,
  Calendar,
  CreditCard,
  Languages
} from "lucide-react";

interface AdminNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function AdminNavigation({ currentPage, onPageChange }: AdminNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isOfficer, isAdmin, isSuperAdmin } = useAuth();
  const { currentLanguage, setLanguage } = useTranslation();
  const { t } = useTranslationWithParams();

  const handleLanguageChange = (language: Language) => {
    setLanguage(language.code);
  };
  
  // Admin-focused navigation items with translations
  const getNavItems = () => {
    const baseItems = [
      { id: 'home', label: t('admin.dashboard'), icon: <BarChart3 className="h-4 w-4" />, type: 'single' },
      { id: 'services', label: t('nav.contactDirectory'), icon: <Users className="h-4 w-4" />, type: 'single' }
    ];

    const officerItems = [
      { 
        id: 'processing', 
        label: t('admin.processing'), 
        icon: <FileText className="h-4 w-4" />, 
        type: 'dropdown',
        items: [
          { id: 'apply-passport', label: t('passport.title'), icon: <FileText className="h-3 w-3" /> },
          { id: 'apply-visa', label: t('visa.title'), icon: <Globe className="h-3 w-3" /> },
          { id: 'appointments', label: t('nav.appointments'), icon: <Calendar className="h-3 w-3" /> },
          { id: 'payments', label: t('service.paymentCenter'), icon: <CreditCard className="h-3 w-3" /> }
        ]
      },
      { 
        id: 'border-control', 
        label: t('admin.borderControl'), 
        icon: <Shield className="h-4 w-4" />, 
        type: 'dropdown',
        items: [
          { id: 'entry-exit', label: t('admin.entryExitLogging'), icon: <Activity className="h-3 w-3" /> },
          { id: 'records', label: t('admin.travelRecords'), icon: <Database className="h-3 w-3" /> },
          { id: 'status', label: t('admin.statusVerification'), icon: <Search className="h-3 w-3" /> }
        ]
      },
      { 
        id: 'biometrics', 
        label: t('admin.biometrics'), 
        icon: <Fingerprint className="h-4 w-4" />, 
        type: 'dropdown',
        items: [
          { id: 'enroll-biometrics', label: t('admin.enrollment'), icon: <Fingerprint className="h-3 w-3" /> },
          { id: 'verify-identity', label: t('admin.verification'), icon: <Shield className="h-3 w-3" /> },
          { id: 'biometric-centers', label: t('admin.centers'), icon: <Users className="h-3 w-3" /> }
        ]
      }
    ];

    const adminItems = [
      { 
        id: 'security', 
        label: t('admin.security'), 
        icon: <Database className="h-4 w-4" />, 
        type: 'dropdown',
        items: [
          { id: 'interpol', label: t('admin.interpol'), icon: <Globe className="h-3 w-3" /> },
          { id: 'alerts', label: t('admin.watchlist'), icon: <AlertTriangle className="h-3 w-3" /> },
          { id: 'agencies', label: t('admin.multiAgency'), icon: <Users className="h-3 w-3" /> }
        ]
      },
      { 
        id: 'analytics', 
        label: t('admin.analytics'), 
        icon: <BarChart3 className="h-4 w-4" />, 
        type: 'single'
      },
      { 
        id: 'admin-dashboard', 
        label: t('admin.management'), 
        icon: <Settings className="h-4 w-4" />, 
        type: 'single'
      }
    ];

    const superAdminItems: any[] = [];

    let navItems = [...baseItems, ...officerItems];
    
    if (isAdmin || isSuperAdmin) {
      navItems = [...navItems, ...adminItems];
    }

    if (isSuperAdmin) {
      navItems = [...navItems, ...superAdminItems];
    }

    return navItems;
  };

  const navItems = getNavItems();

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsOpen(false);
  };

  const renderNavItem = (item: any) => {
    if (item.type === 'single') {
      return (
        <Button
          key={item.id}
          variant={currentPage === item.id ? "default" : "ghost"}
          onClick={() => onPageChange(item.id)}
          className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all ${
            currentPage === item.id 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
              : 'text-foreground hover:bg-muted hover:text-foreground'
          }`}
          size="sm"
        >
          {item.icon}
          <span className="hidden lg:inline">{item.label}</span>
        </Button>
      );
    }

    if (item.type === 'dropdown') {
      const isActive = item.items.some((subItem: any) => currentPage === subItem.id);
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'text-foreground hover:bg-muted hover:text-foreground'
              }`}
              size="sm"
            >
              {item.icon}
              <span className="hidden lg:inline">{item.label}</span>
              <span className="text-xs hidden lg:inline ml-1">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-popover border border-border">
            {item.items.map((subItem: any, index: number) => (
              <div key={subItem.id}>
                <DropdownMenuItem 
                  onClick={() => onPageChange(subItem.id)}
                  className={`flex items-center space-x-2 cursor-pointer hover:bg-accent text-foreground ${
                    subItem.id === currentPage ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  {subItem.icon}
                  <span>{subItem.label}</span>
                  {subItem.id === currentPage && (
                    <Badge variant="secondary" className="ml-auto text-xs bg-primary text-primary-foreground">{t('ui.active')}</Badge>
                  )}
                </DropdownMenuItem>
                {index < item.items.length - 1 && subItem.separator && (
                  <DropdownMenuSeparator className="bg-border" />
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'officer': return 'bg-blue-medium text-white';
      case 'admin': return 'bg-blue-light text-navy-dark';
      case 'super-admin': return 'bg-yellow-500 text-navy-dark';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'officer': return t('role.officer');
      case 'admin': return t('role.admin');
      case 'super-admin': return t('role.superAdmin');
      default: return t('role.customer');
    }
  };

  // Mock notification count
  const notificationCount = 5;

  return (
    <nav className="bg-background border-b-2 border-border sticky top-0 z-50 shadow-lg transition-colors duration-300">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg border-2 border-primary/30 flex-shrink-0">
                <Shield className="h-7 w-7 text-foreground" />
              </div>
              <div className="hidden sm:flex flex-col justify-center">
                <h1 className="text-lg font-bold text-foreground tracking-wide leading-tight">
                  {t('service.borderControl')} {t('admin.dashboard')}
                </h1>
                <div className="text-xs text-muted-foreground font-medium leading-tight mt-0.5">
                  {t('admin.dashboard')} • {t('org.rwandaImmigration')}
                </div>
              </div>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-foreground">{t('service.borderControl')}</h1>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder={t('system.search') + ' ' + t('nav.applications') + ', ' + t('admin.travelRecords') + ', ' + t('admin.users') + '...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(renderNavItem)}
          </div>

          {/* User Menu, Notifications & Mobile Navigation */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Language Selector */}
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              className="text-foreground hover:bg-muted"
            />

            {/* Theme Toggle */}
            <ThemeToggle 
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-muted"
              showLabel={false}
            />

            {/* User Profile Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2 h-auto hover:bg-muted border border-border/50">
                    <Avatar className="h-9 w-9 border-2 border-primary">
                      <AvatarFallback className="text-sm bg-primary text-primary-foreground font-bold">
                        {getUserInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</div>
                      <Badge variant="secondary" className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-popover border border-border">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="font-semibold text-foreground">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground mt-1">{user.department || t('org.rwandaImmigration')}</div>
                    <Badge variant="secondary" className={`text-xs mt-2 ${getRoleBadgeColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                  <DropdownMenuItem className="flex items-center space-x-3 cursor-pointer hover:bg-accent text-foreground py-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{t('nav.profile')} {t('nav.settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-3 cursor-pointer hover:bg-accent text-foreground py-3">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>{t('admin.settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-3 cursor-pointer hover:bg-accent text-foreground py-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>{t('admin.auditLogs')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="flex items-center space-x-3 cursor-pointer text-destructive hover:bg-destructive/10 py-3"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.signOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 text-foreground hover:bg-muted">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-card border-l border-border">
                  <div className="flex flex-col space-y-6 mt-8">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <input
                        type="text"
                        placeholder={t('system.search') + '...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    {/* Mobile User Info */}
                    {user && (
                      <div className="flex items-center space-x-3 pb-4 border-b border-border">
                        <Avatar className="h-12 w-12 border-2 border-primary">
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {getUserInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <Badge variant="secondary" className={`text-xs mt-1 ${getRoleBadgeColor(user.role)}`}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* Mobile Navigation Items */}
                    {navItems.map((item) => (
                      <div key={item.id} className="space-y-2">
                        {item.type === 'single' ? (
                          <Button
                            variant={currentPage === item.id ? "default" : "ghost"}
                            onClick={() => handlePageChange(item.id)}
                            className={`flex items-center space-x-3 justify-start h-12 text-left w-full ${
                              currentPage === item.id 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-foreground hover:bg-muted'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Button>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-muted-foreground">
                              {item.icon}
                              <span>{item.label}</span>
                            </div>
                            <div className="ml-6 space-y-1">
                              {item.items.map((subItem: any) => (
                                <Button
                                  key={subItem.id}
                                  variant={currentPage === subItem.id ? "default" : "ghost"}
                                  onClick={() => handlePageChange(subItem.id)}
                                  className={`flex items-center space-x-3 justify-start h-10 text-left w-full ${
                                    currentPage === subItem.id 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'text-foreground hover:bg-muted'
                                  }`}
                                  size="sm"
                                >
                                  {subItem.icon}
                                  <span>{subItem.label}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Mobile User Actions */}
                    {user && (
                      <div className="pt-4 border-t border-border space-y-2">
                        <Button
                          variant="ghost"
                          className="flex items-center space-x-3 justify-start h-10 text-left w-full text-foreground hover:bg-muted"
                          size="sm"
                        >
                          <User className="h-4 w-4" />
                          <span>{t('nav.profile')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex items-center space-x-3 justify-start h-10 text-left w-full text-foreground hover:bg-muted"
                          size="sm"
                        >
                          <Settings className="h-4 w-4" />
                          <span>{t('nav.settings')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={logout}
                          className="flex items-center space-x-3 justify-start h-10 text-left w-full text-destructive hover:bg-destructive/10"
                          size="sm"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t('nav.signOut')}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}