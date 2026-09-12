import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, Translations, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  formatCurrency: (value: number, currencySymbol?: string) => string;
  formatPercent: (value: number) => string;
  formatDate: (dateString: string | Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const langParam = p.get('lang');
      if (langParam === 'de' || langParam === 'en') return langParam;
    }
    const saved = localStorage.getItem('neofreq_lang');
    if (saved === 'de' || saved === 'en') return saved;
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('neofreq_lang', lang);
    } catch (e) {
      console.warn('Could not persist language to localStorage', e);
    }
  };

  const t = translations[language];

  const formatCurrency = (value: number, currencySymbol = '€'): string => {
    const locale = language === 'de' ? 'de-DE' : 'en-US';
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    const symbol =
      currencySymbol === 'EUR'
        ? '€'
        : currencySymbol === 'USD' || currencySymbol === 'USDT'
        ? '$'
        : currencySymbol;

    return language === 'de' ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
  };

  const formatPercent = (value: number): string => {
    const locale = language === 'de' ? 'de-DE' : 'en-US';
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    return `${formatted}%`;
  };

  const formatDate = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const locale = language === 'de' ? 'de-DE' : 'en-US';
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatCurrency,
        formatPercent,
        formatDate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
