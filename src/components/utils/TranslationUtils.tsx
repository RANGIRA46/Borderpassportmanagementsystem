import { useTranslation } from './LanguageSelector';

// Enhanced translation utilities and hooks

export interface TranslationKey {
  key: string;
  fallback?: string;
  params?: Record<string, string | number>;
}

// Hook for complex translations with parameters
export function useTranslationWithParams() {
  const { translate, currentLanguage } = useTranslation();
  
  const t = (key: string, params?: Record<string, string | number>, fallback?: string): string => {
    let translation = translate(key, fallback);
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(value));
      });
    }
    
    return translation;
  };
  
  return { t, currentLanguage, translate };
}

// Utility functions for date and number formatting based on language
export function formatDate(date: Date, language: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const locales = {
    en: 'en-US',
    fr: 'fr-FR',
    sw: 'sw-TZ',
    rw: 'rw-RW'
  };
  
  return date.toLocaleDateString(locales[language as keyof typeof locales] || 'en-US', options);
}

export function formatCurrency(amount: number, language: string): string {
  const currencyFormats = {
    en: { currency: 'USD', locale: 'en-US' },
    fr: { currency: 'RWF', locale: 'fr-RW' },
    sw: { currency: 'RWF', locale: 'sw-TZ' },
    rw: { currency: 'RWF', locale: 'rw-RW' }
  };
  
  const format = currencyFormats[language as keyof typeof currencyFormats] || currencyFormats.en;
  
  return new Intl.NumberFormat(format.locale, {
    style: 'currency',
    currency: format.currency
  }).format(amount);
}

// Direction utilities for RTL languages (if needed in future)
export function getTextDirection(language: string): 'ltr' | 'rtl' {
  const rtlLanguages = ['ar', 'he', 'fa']; // Arabic, Hebrew, Persian
  return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
}

// Component for rendering translated text with HTML support
interface TranslatedHTMLProps {
  translationKey: string;
  fallback?: string;
  params?: Record<string, string | number>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function TranslatedHTML({ 
  translationKey, 
  fallback, 
  params, 
  className = "",
  as: Component = 'span' 
}: TranslatedHTMLProps) {
  const { t } = useTranslationWithParams();
  const translatedText = t(translationKey, params, fallback);
  
  return (
    <Component 
      className={className}
      dangerouslySetInnerHTML={{ __html: translatedText }}
    />
  );
}

// Language-specific validation patterns
export function getValidationPatterns(language: string) {
  const patterns = {
    en: {
      name: /^[A-Za-z\s'-]+$/,
      phone: /^\+?[\d\s()-]+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    fr: {
      name: /^[A-Za-zÀ-ÿ\s'-]+$/,
      phone: /^\+?[\d\s()-]+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    sw: {
      name: /^[A-Za-z\s'-]+$/,
      phone: /^\+?[\d\s()-]+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    rw: {
      name: /^[A-Za-z\s'-]+$/,
      phone: /^\+?[\d\s()-]+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  };
  
  return patterns[language as keyof typeof patterns] || patterns.en;
}

// Error message translations
export const ERROR_TRANSLATIONS = {
  en: {
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email address',
    'validation.phone': 'Please enter a valid phone number',
    'validation.minLength': 'Minimum {{length}} characters required',
    'validation.maxLength': 'Maximum {{length}} characters allowed',
    'validation.pattern': 'Invalid format'
  },
  fr: {
    'validation.required': 'Ce champ est obligatoire',
    'validation.email': 'Veuillez entrer une adresse email valide',
    'validation.phone': 'Veuillez entrer un numéro de téléphone valide',
    'validation.minLength': 'Minimum {{length}} caractères requis',
    'validation.maxLength': 'Maximum {{length}} caractères autorisés',
    'validation.pattern': 'Format invalide'
  },
  sw: {
    'validation.required': 'Sehemu hii inahitajika',
    'validation.email': 'Tafadhali ingiza anwani halali ya barua pepe',
    'validation.phone': 'Tafadhali ingiza nambari halali ya simu',
    'validation.minLength': 'Angalau herufi {{length}} zinahitajika',
    'validation.maxLength': 'Herufi {{length}} ni za juu zaidi',
    'validation.pattern': 'Muundo si sahihi'
  },
  rw: {
    'validation.required': 'Ibi bikoresho birasabwa',
    'validation.email': 'Nyamuneka injiza aderesi y\'imeyili nyayo',
    'validation.phone': 'Nyamuneka injiza nimero y\'iterefone nyayo',
    'validation.minLength': 'Byibuze inyuguti {{length}} zirasabwa',
    'validation.maxLength': 'Inyuguti {{length}} ni nyinshi',
    'validation.pattern': 'Imiterere itafite icyo ishimba'
  }
};

// Hook for form validation with translations
export function useFormValidation() {
  const { currentLanguage } = useTranslation();
  
  const getErrorMessage = (errorType: string, params?: Record<string, string | number>): string => {
    const translations = ERROR_TRANSLATIONS[currentLanguage as keyof typeof ERROR_TRANSLATIONS] || ERROR_TRANSLATIONS.en;
    let message = translations[errorType as keyof typeof translations] || errorType;
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        message = message.replace(`{{${key}}}`, String(value));
      });
    }
    
    return message;
  };
  
  const validateField = (value: string, rules: any): string | null => {
    if (rules.required && !value.trim()) {
      return getErrorMessage('validation.required');
    }
    
    if (rules.email && value && !getValidationPatterns(currentLanguage).email.test(value)) {
      return getErrorMessage('validation.email');
    }
    
    if (rules.phone && value && !getValidationPatterns(currentLanguage).phone.test(value)) {
      return getErrorMessage('validation.phone');
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return getErrorMessage('validation.minLength', { length: rules.minLength });
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      return getErrorMessage('validation.maxLength', { length: rules.maxLength });
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return getErrorMessage('validation.pattern');
    }
    
    return null;
  };
  
  return { getErrorMessage, validateField };
}

// Language persistence utilities
export function persistLanguagePreference(language: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('borderpass_language', language);
    localStorage.setItem('borderpass_language_timestamp', Date.now().toString());
  }
}

export function getPersistedLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  
  const language = localStorage.getItem('borderpass_language');
  const timestamp = localStorage.getItem('borderpass_language_timestamp');
  
  // Check if preference is less than 30 days old
  if (language && timestamp) {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    if (parseInt(timestamp) > thirtyDaysAgo) {
      return language;
    }
  }
  
  return null;
}

// Browser language detection
export function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  
  const browserLanguage = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLanguage.split('-')[0].toLowerCase();
  
  // Map browser languages to supported languages
  const supportedLanguages = ['en', 'fr', 'sw', 'rw'];
  
  if (supportedLanguages.includes(langCode)) {
    return langCode;
  }
  
  // Regional mappings
  if (langCode === 'fr' || browserLanguage.includes('fr')) return 'fr';
  if (langCode === 'sw' || browserLanguage.includes('sw')) return 'sw';
  if (langCode === 'rw' || browserLanguage.includes('rw')) return 'rw';
  
  return 'en'; // Default fallback
}

// Component for language-aware content rendering
interface LanguageAwareContentProps {
  content: {
    en: string;
    fr: string;
    sw: string;
    rw: string;
  };
  className?: string;
}

export function LanguageAwareContent({ content, className = "" }: LanguageAwareContentProps) {
  const { currentLanguage } = useTranslation();
  
  return (
    <div className={className}>
      {content[currentLanguage as keyof typeof content] || content.en}
    </div>
  );
}

// Export commonly used translation keys as constants
export const COMMON_TRANSLATIONS = {
  LOADING: 'system.loading',
  ERROR: 'system.error',
  SUCCESS: 'system.success',
  SAVE: 'system.save',
  CANCEL: 'system.cancel',
  SUBMIT: 'system.submit',
  REQUIRED: 'form.required',
  OPTIONAL: 'form.optional'
} as const;