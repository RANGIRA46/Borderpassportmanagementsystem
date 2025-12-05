import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ThemeToggle, useTheme } from "./utils/ThemeProvider";
import { LanguageSelector, useTranslation } from "./utils/LanguageSelector";
import { useTranslationWithParams } from "./utils/TranslationUtils";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Settings, Palette, Languages, Keyboard, Bell, Shield } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";

export function PreferencesPanel() {
  const { t } = useTranslationWithParams();
  const { theme, themeMode } = useTheme();
  const { currentLanguage, setLanguage } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-3">
            <Settings className="h-8 w-8 text-navy-medium dark:text-blue-400" />
            {t('preferences.title', {}, 'Preferences')}
          </h1>
          <p className="text-navy-medium/60 dark:text-white/60 mt-2">
            {t('preferences.subtitle', {}, 'Customize your experience with the Border & Passport Management System')}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Shield className="h-3 w-3 mr-1" />
          {t('preferences.version', {}, 'v2.0')}
        </Badge>
      </div>

      <Separator />

      {/* Appearance Settings */}
      <Card className="border-navy-medium/20 dark:border-white/10 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-navy-dark/5 to-blue-medium/5 dark:from-blue-500/5 dark:to-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-navy-medium/10 dark:bg-blue-500/10 flex items-center justify-center">
              <Palette className="h-5 w-5 text-navy-medium dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>{t('preferences.appearance', {}, 'Appearance')}</CardTitle>
              <CardDescription>
                {t('preferences.appearanceDesc', {}, 'Customize the look and feel of your interface')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Theme Toggle - Expanded Mode */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">{t('preferences.themeMode', {}, 'Theme Mode')}</Label>
                <p className="text-sm text-navy-medium/60 dark:text-white/60 mt-1">
                  {t('preferences.themeModeDesc', {}, 'Choose between light, dark, or auto mode')}
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {t('preferences.enhanced', {}, 'Enhanced')}
              </Badge>
            </div>
            
            {/* Expanded Theme Toggle */}
            <ThemeToggle expanded />
            
            {/* Current Theme Info */}
            <div className="mt-4 p-4 rounded-lg bg-blue-lightest dark:bg-[#1E1E1E] border border-blue-light/20 dark:border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-medium dark:text-white/80">
                  {t('preferences.currentTheme', {}, 'Current Theme')}:
                </span>
                <span className="font-medium text-navy-dark dark:text-white">
                  {theme === "dark" ? t('theme.dark', {}, 'Dark') : t('theme.light', {}, 'Light')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-navy-medium dark:text-white/80">
                  {t('preferences.mode', {}, 'Mode')}:
                </span>
                <span className="font-medium text-navy-dark dark:text-white capitalize">
                  {themeMode}
                </span>
              </div>
            </div>

            {/* Theme Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-white dark:bg-[#1E1E1E] border border-blue-light/20 dark:border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-navy-medium dark:text-white/60">
                    {t('preferences.systemSync', {}, 'System Sync')}
                  </span>
                </div>
                <p className="text-xs text-navy-dark dark:text-white">
                  {themeMode === "auto" ? t('preferences.enabled', {}, 'Enabled') : t('preferences.disabled', {}, 'Disabled')}
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-white dark:bg-[#1E1E1E] border border-blue-light/20 dark:border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-navy-medium dark:text-white/60">
                    {t('preferences.smoothTransitions', {}, 'Smooth Transitions')}
                  </span>
                </div>
                <p className="text-xs text-navy-dark dark:text-white">
                  {t('preferences.enabled', {}, 'Enabled')}
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-white dark:bg-[#1E1E1E] border border-blue-light/20 dark:border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-navy-medium dark:text-white/60">
                    {t('preferences.persistence', {}, 'Persistence')}
                  </span>
                </div>
                <p className="text-xs text-navy-dark dark:text-white">
                  {t('preferences.localStorage', {}, 'Local Storage')}
                </p>
              </div>
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-medium/5 dark:bg-blue-500/5 border border-blue-medium/20 dark:border-blue-500/20">
              <Keyboard className="h-4 w-4 text-blue-medium dark:text-blue-400" />
              <span className="text-sm text-navy-dark dark:text-white">
                {t('preferences.shortcut', {}, 'Keyboard Shortcut')}:
              </span>
              <kbd className="px-2 py-1 text-xs bg-white dark:bg-[#1E1E1E] border border-blue-light/30 dark:border-white/10 rounded">
                Ctrl + Shift + T
              </kbd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="border-navy-medium/20 dark:border-white/10 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-navy-dark/5 to-blue-medium/5 dark:from-blue-500/5 dark:to-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-navy-medium/10 dark:bg-blue-500/10 flex items-center justify-center">
              <Languages className="h-5 w-5 text-navy-medium dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>{t('preferences.language', {}, 'Language')}</CardTitle>
              <CardDescription>
                {t('preferences.languageDesc', {}, 'Select your preferred language for the interface')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">{t('preferences.interfaceLanguage', {}, 'Interface Language')}</Label>
              <p className="text-sm text-navy-medium/60 dark:text-white/60 mt-1">
                {t('preferences.currentLanguage', {}, 'Current')}: {currentLanguage.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { code: 'en', name: 'English', flag: '🇬🇧' },
              { code: 'fr', name: 'Français', flag: '🇫🇷' },
              { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
              { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentLanguage === lang.code
                    ? 'border-navy-medium dark:border-blue-500 bg-navy-medium/5 dark:bg-blue-500/10'
                    : 'border-blue-light/30 dark:border-white/10 hover:border-navy-medium/50 dark:hover:border-blue-500/50'
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="text-sm font-medium text-navy-dark dark:text-white">{lang.name}</div>
                {currentLanguage === lang.code && (
                  <Badge variant="secondary" className="mt-2 text-xs w-full">
                    {t('preferences.active', {}, 'Active')}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <Card className="border-navy-medium/20 dark:border-white/10 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-navy-dark/5 to-blue-medium/5 dark:from-blue-500/5 dark:to-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-navy-medium/10 dark:bg-blue-500/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-navy-medium dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>{t('preferences.notifications', {}, 'Notifications')}</CardTitle>
              <CardDescription>
                {t('preferences.notificationsDesc', {}, 'Manage your notification preferences')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-blue-lightest dark:bg-[#1E1E1E]">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">{t('preferences.enableNotifications', {}, 'Enable Notifications')}</Label>
              <p className="text-sm text-navy-medium/60 dark:text-white/60">
                {t('preferences.enableNotificationsDesc', {}, 'Receive updates about your applications')}
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-blue-lightest dark:bg-[#1E1E1E]">
            <div className="space-y-0.5">
              <Label htmlFor="autosave">{t('preferences.autoSave', {}, 'Auto-Save')}</Label>
              <p className="text-sm text-navy-medium/60 dark:text-white/60">
                {t('preferences.autoSaveDesc', {}, 'Automatically save your progress')}
              </p>
            </div>
            <Switch
              id="autosave"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
