import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { changeLanguage, getCurrentLanguage, getSupportedLanguages } from '@/i18n';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string>(getCurrentLanguage());
  const [supportedLanguages] = useState<Language[]>(getSupportedLanguages());

  useEffect(() => {
    // Listen for language change events
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLang(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  // Update current language when i18n changes
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
  };

  const currentLanguageInfo = supportedLanguages.find(lang => lang.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 h-10 px-3"
        >
          <span className="text-lg">{currentLanguageInfo?.flag}</span>
          <span className="hidden sm:inline">
            {currentLanguageInfo?.nativeName || currentLanguageInfo?.name}
          </span>
          <svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              currentLang === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
            {currentLang === language.code && (
              <svg 
                className="h-4 w-4 ml-auto text-primary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
