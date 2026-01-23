import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const TestSimple = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Language Test - Current: {i18n.language}</h1>
      <p>App Name: {t('appName')}</p>
      <p>Tagline: {t('tagline')}</p>
      <p>Get Started: {t('getStarted')}</p>
      <p>Login: {t('login')}</p>
      <p>Dashboard: {t('dashboard')}</p>
      <p>About: {t('about')}</p>
      <p>Hero Title: {t('heroTitle')}</p>
      <p>Hero Subtitle: {t('heroSubtitle')}</p>
      <p>Weather: {t('weatherInfo')}</p>
      <p>Alerts: {t('alerts')}</p>
      <p>Success: {t('success')}</p>
      <p>Error: {t('error')}</p>
      <p>Loading: {t('loading')}</p>
      <p>Save: {t('save')}</p>
      <p>Cancel: {t('cancel')}</p>
    </div>
  );
};

export default TestSimple;
