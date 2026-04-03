import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Home,
  FileText,
  Globe,
  Calendar,
  Upload,
  CreditCard,
  Search,
  HelpCircle,
  User,
  Bell,
  LogOut,
  Settings,
  Shield,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProfessionalNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userRole?: 'customer' | 'officer' | 'admin';
  userName?: string;
}

export function ProfessionalNavigation({
  currentPage,
  onPageChange,
  userRole = 'customer',
  userName = 'Guest User'
}: ProfessionalNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const customerNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'apply-passport', label: 'Passport', icon: FileText },
    { id: 'apply-visa', label: 'Visa', icon: Globe },
    { id: 'status', label: 'Track Status', icon: Search },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  const notifications = 3;

  return (
    <nav className="border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0D1526]/95 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onPageChange('home')}
              className="flex items-center gap-3 group"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-bold text-navy-dark dark:text-white leading-none">
                  National Border System
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                  Digital Immigration Services
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {customerNavItems.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {userName.charAt(0)}
                </div>
                <span className="hidden lg:inline text-sm font-medium text-navy-dark dark:text-white">
                  {userName}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E293B] rounded-lg shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-200 dark:border-white/10">
                      <p className="text-sm font-medium text-navy-dark dark:text-white">
                        {userName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {userRole === 'admin' ? 'Administrator' : 'Customer Account'}
                      </p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-sm text-slate-600 dark:text-slate-300">
                        <User className="h-4 w-4" />
                        Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-sm text-slate-600 dark:text-slate-300">
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-sm text-slate-600 dark:text-slate-300">
                        <HelpCircle className="h-4 w-4" />
                        Help & Support
                      </button>
                    </div>
                    <div className="p-2 border-t border-slate-200 dark:border-white/10">
                      <button
                        onClick={() => onPageChange('login')}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-sm text-red-600 dark:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              ) : (
                <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {customerNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                      currentPage === item.id
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
