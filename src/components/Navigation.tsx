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
import { LanguageSelector, useTranslation, TranslationProvider, Language, T } from "./utils/LanguageSelector";
import { useTranslationWithParams } from "./utils/TranslationUtils";
import { ThemeToggle } from "./utils/ThemeProvider";
import { 
  User, 
  LogOut, 
  Settings, 
  Menu,
  Shield,
  Globe,
  LogIn,
  Heart,
  HelpCircle,
  Home,
  FileText,
  Phone,
  Target,
  BookOpen,
  Clipboard,
  CreditCard,
  HandHeart,
  MapPin,
  CalendarDays,
  Search,
  MessageCircle,
  Paperclip,
  Ticket,
  Languages
} from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isCustomer } = useAuth();
  const { currentLanguage, setLanguage } = useTranslation();
  const { t } = useTranslationWithParams();

  const handleLanguageChange = (language: Language) => {
    setLanguage(language.code);
  };
  
  // Customer/Public focused navigation items with translations
  const navItems = [
    { id: 'home', label: t('nav.home'), icon: <Home className="h-4 w-4" />, type: 'single' },
    { id: 'overview', label: t('nav.about'), icon: <FileText className="h-4 w-4" />, type: 'single' },
    { id: 'services', label: t('nav.services'), icon: <Phone className="h-4 w-4" />, type: 'single' },
    { 
      id: 'digital-passport', 
      label: t('service.digitalPass', {}, 'Digital Passport'), 
      icon: <Ticket className="h-4 w-4" />, 
      type: 'dropdown',
      items: [
        { id: 'border-pass', label: t('service.digitalPass'), icon: <Ticket className="h-3 w-3" /> },
        { id: 'status', label: t('nav.status'), icon: <Search className="h-3 w-3" /> },
        { id: 'payments', label: t('service.paymentCenter'), icon: <CreditCard className="h-3 w-3" /> }
      ]
    },
    { 
      id: 'support', 
      label: t('nav.help'), 
      icon: <MessageCircle className="h-4 w-4" />, 
      type: 'single',
      target: 'help'
    }
  ];

  const handlePageChange = (page: string) => {
    // Handle special case where nav item has a target
    const targetPage = navItems.find(item => item.id === page)?.target || page;
    onPageChange(targetPage);
    setIsOpen(false);
  };

  const renderNavItem = (item: any) => {
    if (item.type === 'single') {
      return (
        <Button
          key={item.id}
          variant={currentPage === item.id ? "default" : "ghost"}
          onClick={() => onPageChange(item.id)}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            currentPage === item.id 
              ? 'bg-primary text-primary-foreground shadow-md' 
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
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-foreground hover:bg-muted hover:text-foreground'
              }`}
              size="sm"
            >
              {item.icon}
              <span className="hidden lg:inline">{item.label}</span>
              <span className="text-xs hidden lg:inline ml-1">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-popover border border-border shadow-lg">
            {item.items.map((subItem: any, index: number) => (
              <div key={subItem.id}>
                <DropdownMenuItem 
                  onClick={() => onPageChange(subItem.id)}
                  className={`flex items-center space-x-2 cursor-pointer hover:bg-accent rounded-md mx-1 ${
                    subItem.id === currentPage ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  }`}
                >
                  {subItem.icon}
                  <span>{subItem.label}</span>
                  {subItem.id === currentPage && (
                    <Badge variant="secondary" className="ml-auto text-xs bg-primary text-primary-foreground">Active</Badge>
                  )}
                </DropdownMenuItem>
                {index < item.items.length - 1 && subItem.separator && (
                  <DropdownMenuSeparator />
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

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">
                {t('org.rwandaImmigration')}
              </h1>
              <div className="text-xs text-muted-foreground font-medium">
                {t('org.digitalServicesPortal')}
              </div>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-foreground">{t('org.immigrationPortal')}</h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(renderNavItem)}
          </div>

          {/* User Menu, Language Selector & Mobile Navigation */}
          <div className="flex items-center space-x-3">
            {/* Help Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => handlePageChange('help')}
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{t('nav.help')}</span>
            </Button>

            {/* Language Selector */}
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
            />

            {/* Theme Toggle */}
            <ThemeToggle 
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
              showLabel={false}
            />

            {/* User Profile Dropdown or Login Button */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 h-auto hover:bg-muted rounded-lg">
                    <Avatar className="h-8 w-8 border-2 border-primary">
                      <AvatarFallback className="text-sm bg-primary text-primary-foreground font-medium">
                        {getUserInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-foreground">{user.firstName} {user.lastName}</div>
                      <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                        {t('role.customer')}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border border-border">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="font-medium text-foreground">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <Badge variant="secondary" className="text-xs mt-1 bg-secondary text-secondary-foreground">
                      {t('role.customerAccount')}
                    </Badge>
                  </div>
                  <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-accent">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{t('nav.myProfile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handlePageChange('preferences')}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{t('nav.preferences', {}, 'Preferences')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-accent">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{t('nav.myApplications')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="flex items-center space-x-2 cursor-pointer text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.signOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => onPageChange('login')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2 shadow-md"
                size="sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span>{t('nav.signIn')}</span>
              </Button>
            )}

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 text-muted-foreground hover:bg-muted">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-card border-l border-border">
                  <div className="flex flex-col space-y-6 mt-8">
                    {/* Mobile User Info */}
                    {isAuthenticated && user ? (
                      <div className="flex items-center space-x-3 pb-4 border-b border-border">
                        <Avatar className="h-12 w-12 border-2 border-primary">
                          <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                            {getUserInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <Badge variant="secondary" className="text-xs mt-1 bg-secondary text-secondary-foreground">
                            {t('role.customerAccount')}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="pb-4 border-b border-border">
                        <Button 
                          onClick={() => handlePageChange('login')}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          {t('nav.signInRegister')}
                        </Button>
                      </div>
                    )}
                    
                    {/* Mobile Navigation Items */}
                    {navItems.map((item) => (
                      <div key={item.id} className="space-y-2">
                        {item.type === 'single' ? (
                          <Button
                            variant={currentPage === item.id ? "default" : "ghost"}
                            onClick={() => handlePageChange(item.id)}
                            className={`flex items-center space-x-3 justify-start h-12 text-left w-full rounded-lg ${
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
                            <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                              {item.icon}
                              <span>{item.label}</span>
                            </div>
                            <div className="ml-4 space-y-1">
                              {item.items.map((subItem: any) => (
                                <Button
                                  key={subItem.id}
                                  variant={currentPage === subItem.id ? "default" : "ghost"}
                                  onClick={() => handlePageChange(subItem.id)}
                                  className={`flex items-center space-x-3 justify-start h-10 text-left w-full rounded-lg ${
                                    currentPage === subItem.id 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'text-foreground hover:bg-muted'
                                  }`}
                                  size="sm"
                                >
                                  <span>{subItem.icon}</span>
                                  <span>{subItem.label}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Mobile User Actions */}
                    {isAuthenticated && user && (
                      <div className="pt-4 border-t border-border space-y-2">
                        <Button
                          variant="ghost"
                          className="flex items-center space-x-3 justify-start h-10 text-left w-full text-foreground hover:bg-muted rounded-lg"
                          size="sm"
                        >
                          <User className="h-4 w-4" />
                          <span>{t('nav.myProfile')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex items-center space-x-3 justify-start h-10 text-left w-full text-foreground hover:bg-muted rounded-lg"
                          size="sm"
                        >
                          <Settings className="h-4 w-4" />
                          <span>{t('nav.settings')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={logout}
                          className="flex items-center space-x-3 justify-start h-10 text-left w-full text-destructive hover:bg-destructive/10 rounded-lg"
                          size="sm"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t('nav.signOut')}</span>
                        </Button>
                      </div>
                    )}

                    {/* Language and Help in Mobile */}
                    <div className="pt-4 border-t border-border">
                      <div className="text-sm font-medium text-muted-foreground mb-3">{t('support.supportLanguage')}</div>
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          className="justify-start h-8 w-full text-foreground hover:bg-muted rounded-lg" 
                          size="sm"
                          onClick={() => setLanguage('en')}
                        >
                          <Languages className="h-3 w-3 mr-2" />
                          English
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="justify-start h-8 w-full text-foreground hover:bg-muted rounded-lg" 
                          size="sm"
                          onClick={() => setLanguage('fr')}
                        >
                          <Languages className="h-3 w-3 mr-2" />
                          Français
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="justify-start h-8 w-full text-foreground hover:bg-muted rounded-lg" 
                          size="sm"
                          onClick={() => setLanguage('sw')}
                        >
                          🇹🇿 Kiswahili
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="justify-start h-8 w-full text-foreground hover:bg-muted rounded-lg" 
                          size="sm"
                          onClick={() => setLanguage('rw')}
                        >
                          🇷🇼 Kinyarwanda
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="justify-start h-8 w-full text-foreground hover:bg-muted rounded-lg" 
                          size="sm"
                          onClick={() => handlePageChange('help')}
                        >
                          <HelpCircle className="h-4 w-4 mr-2" />
                          {t('support.helpSupport')}
                        </Button>
                      </div>
                    </div>
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