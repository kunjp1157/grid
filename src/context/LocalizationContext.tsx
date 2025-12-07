"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import { setCookie, getCookie } from 'cookies-next';

type Translations = typeof en;

const translations: { [key: string]: Translations } = {
  en,
  hi,
};

interface LocalizationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const savedLanguage = getCookie('language') as string | undefined;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      setCookie('language', lang, { maxAge: 60 * 60 * 24 * 365 });
    }
  };

  const t = (key: string, replacements?: { [key:string]: string }): string => {
    const keys = key.split('.');
    let current: any = translations[language];
    for (const k of keys) {
      if (current[k] !== undefined) {
        current = current[k];
      } else {
        // Fallback to English if translation not found
        current = translations.en;
        for (const k_en of keys) {
           if (current[k_en] !== undefined) {
             current = current[k_en];
           } else {
             return key;
           }
        }
        break;
      }
    }

    if (typeof current === 'string' && replacements) {
        return Object.entries(replacements).reduce((acc, [key, value]) => {
            return acc.replace(`{${key}}`, value);
        }, current);
    }

    return typeof current === 'string' ? current : key;
  };


  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useTranslation = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LocalizationProvider');
  }
  return context;
};
