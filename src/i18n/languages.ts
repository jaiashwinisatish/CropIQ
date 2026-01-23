// Core translations for 6 major Indian languages

export const languages = {
  en: {
    name: 'English',
    nativeName: 'English',
    code: 'en',
    flag: '🇺🇸',
    rtl: false,
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    code: 'hi',
    flag: '🇮🇳',
    rtl: false,
  },
  bn: {
    name: 'Bengali',
    nativeName: 'বাংলা',
    code: 'bn',
    flag: '🇧🇩',
    rtl: false,
  },
  gu: {
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    code: 'gu',
    flag: '🇮🇳',
    rtl: false,
  },
  ta: {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    code: 'ta',
    flag: '🇮🇳',
    rtl: false,
  },
  te: {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    code: 'te',
    flag: '🇮🇳',
    rtl: false,
  },
};

export const defaultLanguage = 'en';
export const supportedLanguages = Object.keys(languages);
