"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';

// Import all language files
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import as from '@/locales/as.json';
import bn from '@/locales/bn.json';
import brx from '@/locales/brx.json';
import doi from '@/locales/doi.json';
import gu from '@/locales/gu.json';
import kn from '@/locales/kn.json';
import ks from '@/locales/ks.json';
import kok from '@/locales/kok.json';
import mai from '@/locales/mai.json';
import ml from '@/locales/ml.json';
import mni from '@/locales/mni.json';
import mr from '@/locales/mr.json';
import ne from '@/locales/ne.json';
import or from '@/locales/or.json';
import pa from '@/locales/pa.json';
import sa from '@/locales/sa.json';
import sat from '@/locales/sat.json';
import sd from '@/locales/sd.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';
import ur from '@/locales/ur.json';

type Translations = typeof en;

const translations: { [key: string]: Translations } = {
  en, hi, as, bn, brx, doi, gu, kn, ks, kok, mai, ml, mni, mr, ne, or, pa, sa, sat, sd, ta, te, ur
};

export const languages = {
    'en': 'English',
    'hi': 'हिंदी (Hindi)',
    'as': 'অসমীয়া (Assamese)',
    'bn': 'বাংলা (Bengali)',
    'brx': 'बोड़ो (Bodo)',
    'doi': 'डोगरी (Dogri)',
    'gu': 'ગુજરાતી (Gujarati)',
    'kn': 'ಕನ್ನಡ (Kannada)',
    'ks': 'कॉशुर (Kashmiri)',
    'kok': 'कोंकणी (Konkani)',
    'mai': 'मैथिली (Maithili)',
    'ml': 'മലയാളം (Malayalam)',
    'mni': 'মৈতৈলোন্ (Manipuri)',
    'mr': 'मराठी (Marathi)',
    'ne': 'नेपाली (Nepali)',
    'or': 'ଓଡ଼ିଆ (Odia)',
    'pa': 'ਪੰਜਾਬੀ (Punjabi)',
    'sa': 'संस्कृतम् (Sanskrit)',
    'sat': 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
    'sd': 'सिंधी (Sindhi)',
    'ta': 'தமிழ் (Tamil)',
    'te': 'తెలుగు (Telugu)',
    'ur': 'اردو (Urdu)'
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
    let current: any = translations[language] || translations.en;
    for (const k of keys) {
      if (current && typeof current === 'object' && current[k] !== undefined) {
        current = current[k];
      } else {
        // Fallback to English if translation not found in current language
        current = translations.en;
        for (const k_en of keys) {
           if (current && typeof current === 'object' && current[k_en] !== undefined) {
             current = current[k_en];
           } else {
             return key; // Return key if not found in English either
           }
        }
        break; // Exit after fallback attempt
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
