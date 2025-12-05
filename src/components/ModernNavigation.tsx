import { useState } from "react";
import { motion } from "motion/react";
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
import { useTranslation } from "./utils/LanguageSelector";
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
  ChevronDown,
  Sparkles
} from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function ModernNavigation({ currentPage, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isCustomer } = useAuth();
  const { currentLanguage, setLanguage } = useTranslation();
  const { t } = useTranslationWithParams();

  const navItems = [
    { id: 'home', label: t('nav.home', {}, 'Home'), icon: <Home className="h-4 w-4" />, type: 'single' },
    { 
      id: 'applications', 
      label: t('nav.services', {}, 'Services'), 
      icon: <Target className="h-4 w-4" />, 
      type: 'dropdown',
      items: [
        { id: 'apply-passport', label: t('passport.title', {}, 'Passport'), icon: <BookOpen className="h-3 w-3" /> },
        { id: 'apply-visa', label: t('visa.title', {}, 'Visa'), icon: <Globe className="h-3 w-3" /> },
        { id: 'apply-permit', label: t('permit.title', {}, 'Permit'), icon: <Ticket className="h-3 w-3" /> },
        { id: 'apply-citizenship', label: t('citizenship.title', {}, 'Citizenship'), icon: <Shield className="h-3 w-3" /> }
      ]
    },
    { 
      id: 'track', 
      label: t('nav.track', {}, 'Track'), 
      icon: <Search className="h-4 w-4" />, 
      type: 'dropdown',
      items: [
        { id: 'status', label: t('nav.status', {}, 'Check Status'), icon: <Search className="h-3 w-3" /> },
        { id: 'appointments', label: t('nav.appointments', {}, 'Appointments'), icon: <CalendarDays className="h-3 w-3" /> },
        { id: 'payments', label: t('nav.payments', {}, 'Payments'), icon: <CreditCard className="h-3 w-3" /> }
      ]
    },
    { id: 'help', label: t('nav.help', {}, 'Help'), icon: <MessageCircle className="h-4 w-4" />, type: 'single' }
  ];

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsOpen(false);
  };

  const renderNavItem = (item: any) => {
    if (item.type === 'dropdown') {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="text-navy-dark dark:text-white hover:bg-navy-medium/10 dark:hover:bg-white/10 gap-2"
            >
              {item.icon}
              {item.label}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-[#1E1E1E] border-navy-medium/10 dark:border-white/10">
            {item.items.map((subItem: any) => (
              <DropdownMenuItem
                key={subItem.id}
                onClick={() => handlePageChange(subItem.id)}
                className="cursor-pointer hover:bg-blue-lightest dark:hover:bg-white/5"
              >
                {subItem.icon}
                <span className="ml-2">{subItem.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        onClick={() => handlePageChange(item.id)}
        className={`gap-2 ${
          currentPage === item.id
            ? "bg-navy-medium/10 dark:bg-white/10 text-navy-dark dark:text-white"
            : "text-navy-dark dark:text-white hover:bg-navy-medium/10 dark:hover:bg-white/10"
        }`}
      >
        {item.icon}
        {item.label}
      </Button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-lg border-b border-navy-medium/10 dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handlePageChange('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-navy-dark to-navy-medium flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-navy-dark dark:text-white leading-none">
                Rwanda Immigration
              </div>
              <div className="text-xs text-navy-medium/60 dark:text-white/60">
                Digital Services
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map(renderNavItem)}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* User Menu or Login */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border-2 border-navy-medium/20 dark:border-white/20 hover:border-navy-medium dark:hover:border-blue-500"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-navy-medium to-blue-medium text-white">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user.role === 'Super-Admin' && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-gradient-to-br from-yellow-400 to-orange-500 border-0">
                        <Sparkles className="h-3 w-3" />
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-[#1E1E1E] border-navy-medium/10 dark:border-white/10">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-navy-dark dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-navy-medium/60 dark:text-white/60">
                      {user.email}
                    </p>
                    <Badge className="mt-2 text-xs bg-navy-medium/10 text-navy-dark dark:bg-white/10 dark:text-white border-0">
                      {user.role}
                    </Badge>
                  </div>
                  <DropdownMenuSeparator className="bg-navy-medium/10 dark:bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => handlePageChange('preferences')}
                    className="cursor-pointer hover:bg-blue-lightest dark:hover:bg-white/5"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => handlePageChange('login')}
                className="bg-gradient-to-r from-navy-medium to-blue-medium hover:from-navy-dark hover:to-navy-medium text-white gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-navy-dark dark:text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white dark:bg-[#1E1E1E] border-navy-medium/10 dark:border-white/10">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div
                        onClick={() => item.type === 'single' && handlePageChange(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          currentPage === item.id
                            ? "bg-navy-medium/10 dark:bg-white/10 text-navy-dark dark:text-white"
                            : "hover:bg-blue-lightest dark:hover:bg-white/5 text-navy-dark dark:text-white"
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {item.type === 'dropdown' && item.items && (
                        <div className="pl-6 space-y-1">
                          {item.items.map((subItem: any) => (
                            <div
                              key={subItem.id}
                              onClick={() => handlePageChange(subItem.id)}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-lightest dark:hover:bg-white/5 cursor-pointer text-sm text-navy-medium dark:text-white/80"
                            >
                              {subItem.icon}
                              {subItem.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="border-t border-navy-medium/10 dark:border-white/10 pt-4 mt-4">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm text-navy-dark dark:text-white">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
