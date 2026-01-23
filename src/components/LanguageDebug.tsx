import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageDebug: React.FC = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(t('language'));
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [t]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
      <h3 className="font-bold text-lg mb-2">Language Debug</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Current Language:</strong> {currentLang}</p>
        <p><strong>i18n Language:</strong> {t('language')}</p>
        <p><strong>App Name:</strong> {t('appName')}</p>
        <p><strong>Tagline:</strong> {t('tagline')}</p>
        <p><strong>Get Started:</strong> {t('getStarted')}</p>
        <p><strong>Login:</strong> {t('login')}</p>
        <p><strong>Dashboard:</strong> {t('dashboard')}</p>
        <p><strong>About:</strong> {t('about')}</p>
        <p><strong>Hero Title:</strong> {t('heroTitle')}</p>
        <p><strong>Hero Subtitle:</strong> {t('heroSubtitle')}</p>
      </div>
    </div>
  );
};

export default LanguageDebug;
