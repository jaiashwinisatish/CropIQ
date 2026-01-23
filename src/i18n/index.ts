import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languages, defaultLanguage, supportedLanguages } from './languages';
import en from './translations/en';
import hi from './translations/hi';
import bn from './translations/bn';
import gu from './translations/gu';
import ta from './translations/ta';
import te from './translations/te';

// Translation resources
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  gu: { translation: gu },
  ta: { translation: ta },
  te: { translation: te },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Start with English, will be updated by initializeLanguage
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    debug: process.env.NODE_ENV === 'development',
  });

// Get saved language from localStorage or use default
const getSavedLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('cropiq-language') || defaultLanguage;
  }
  return defaultLanguage;
};

// Language switching function with persistence
export const changeLanguage = (languageCode: string) => {
  if (supportedLanguages.includes(languageCode)) {
    i18n.changeLanguage(languageCode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cropiq-language', languageCode);
      // Force React re-render by updating a state
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: languageCode } 
      }));
    }
  }
};

// Get current language
export const getCurrentLanguage = () => {
  return i18n.language;
};

// Get language info
export const getLanguageInfo = (languageCode: string) => {
  return languages[languageCode as keyof typeof languages];
};

// Get all supported languages
export const getSupportedLanguages = () => {
  return Object.values(languages);
};

// Check if language is supported
export const isLanguageSupported = (languageCode: string) => {
  return supportedLanguages.includes(languageCode);
};

// Initialize language on app load
export const initializeLanguage = () => {
  const browserLanguage = typeof window !== 'undefined' 
    ? navigator.language || (navigator as any).userLanguage 
    : defaultLanguage;
  
  // Check if browser language is supported
  const supportedBrowserLang = supportedLanguages.find(lang => 
    browserLanguage.toLowerCase().startsWith(lang.toLowerCase())
  );
  
  const initialLanguage = getSavedLanguage();
  
  if (initialLanguage !== i18n.language) {
    changeLanguage(initialLanguage);
  }
  
  return initialLanguage;
};

export default i18n;
