import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Languages, Check, Globe } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useTranslation } from "../utils/LanguageSelector";

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', color: 'from-blue-600 to-blue-700' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', color: 'from-blue-500 to-indigo-600' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', color: 'from-green-600 to-emerald-700' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', color: 'from-yellow-500 to-orange-600' }
];

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage } = useTranslation();

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-20 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-3"
          >
            <Card className="w-72 p-3 shadow-2xl border-navy-medium/20 dark:border-white/10 bg-white dark:bg-[#1E1E1E] backdrop-blur-lg">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-navy-medium/10 dark:border-white/10">
                <Globe className="h-4 w-4 text-navy-medium dark:text-blue-400" />
                <span className="text-sm font-medium text-navy-dark dark:text-white">
                  Select Language
                </span>
              </div>
              
              <div className="space-y-2">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      currentLanguage === lang.code
                        ? 'bg-gradient-to-r ' + lang.color + ' text-white shadow-md'
                        : 'bg-blue-lightest dark:bg-[#121212] hover:bg-navy-medium/5 dark:hover:bg-white/5 text-navy-dark dark:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">{lang.name}</div>
                        <div className={`text-xs ${
                          currentLanguage === lang.code 
                            ? 'text-white/80' 
                            : 'text-navy-medium/60 dark:text-white/60'
                        }`}>
                          {lang.nativeName}
                        </div>
                      </div>
                    </div>
                    {currentLanguage === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-navy-medium/10 dark:border-white/10">
                <p className="text-xs text-center text-navy-medium/60 dark:text-white/60">
                  Language changes apply immediately
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 px-4 rounded-full shadow-2xl bg-gradient-to-r ${currentLang.color} hover:shadow-3xl text-white border-0 relative overflow-hidden group`}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          
          <div className="relative z-10 flex items-center gap-2">
            <span className="text-2xl">{currentLang.flag}</span>
            <div className="hidden sm:block text-left">
              <div className="text-xs opacity-80 leading-none">Language</div>
              <div className="text-sm font-medium leading-none mt-0.5">
                {currentLang.code.toUpperCase()}
              </div>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Languages className="h-4 w-4 ml-1" />
            </motion.div>
          </div>

          {/* Pulse effect */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </Button>
      </motion.div>
    </div>
  );
}
