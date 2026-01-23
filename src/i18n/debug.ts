// Debug i18n configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languages, defaultLanguage, supportedLanguages } from './languages';
import en from './translations/en';
import hi from './translations/hi';
import bn from './translations/bn';
import gu from './translations/gu';
import ta from './translations/ta';
import te from './translations/te';

console.log('=== i18n Debug Info ===');
console.log('Default Language:', defaultLanguage);
console.log('Supported Languages:', supportedLanguages);
console.log('Available Languages:', Object.keys(languages));

// Test translation loading
try {
  console.log('Testing English translation:', en.appName);
  console.log('Testing Hindi translation:', hi.appName);
  console.log('Testing Bengali translation:', bn.appName);
} catch (error) {
  console.error('Error loading translations:', error);
}

// Test i18n initialization
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      gu: { translation: gu },
      ta: { translation: ta },
      te: { translation: te },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    debug: true,
  })
  .then(() => {
    console.log('i18n initialized successfully');
    console.log('Current language:', i18n.language);
    console.log('Available languages:', Object.keys(i18n.options.resources));
  })
  .catch((error) => {
    console.error('i18n initialization error:', error);
  });

export { i18n, changeLanguage, getCurrentLanguage, getSupportedLanguages };
