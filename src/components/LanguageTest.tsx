import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LanguageTest: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Language Test Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>App Name:</strong> {t('appName')}</p>
          <p><strong>Tagline:</strong> {t('tagline')}</p>
          <p><strong>Get Started:</strong> {t('getStarted')}</p>
          <p><strong>Login:</strong> {t('login')}</p>
          <p><strong>Dashboard:</strong> {t('dashboard')}</p>
          <p><strong>About:</strong> {t('about')}</p>
          <p><strong>Hero Title:</strong> {t('heroTitle')}</p>
          <p><strong>Hero Subtitle:</strong> {t('heroSubtitle')}</p>
          <p><strong>No Hardware:</strong> {t('noHardware')}</p>
          <p><strong>AI Powered:</strong> {t('aiPowered')}</p>
          <p><strong>Simple Input:</strong> {t('simpleInput')}</p>
          <p><strong>Weather:</strong> {t('weatherInfo')}</p>
          <p><strong>Alerts:</strong> {t('alerts')}</p>
          <p><strong>Success:</strong> {t('success')}</p>
          <p><strong>Error:</strong> {t('error')}</p>
          <p><strong>Loading:</strong> {t('loading')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageTest;
