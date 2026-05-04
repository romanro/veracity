'use client';
import React from 'react';
import { i18nConfig } from '@/i18n/config';
import { type TLocale } from '@/i18n/i18n.models';
import { useLocaleSync } from '@libs/hooks/useLocaleSync';

export const LanguageSwitcherSelect = () => {
  const { locale: currentLang, setLocale } = useLocaleSync();

  const { languages } = i18nConfig;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value as TLocale;
    if (i18nConfig.locales.includes(newLang)) {
      setLocale(newLang);
    }
  };

  return (
    <select value={currentLang} onChange={handleChange} className='rounded px-2 py-1 outline-none'>

      {languages.map(({ code, flag }) => (

        <option key={code} value={code}>
          {flag}
        </option>
      ))}
    </select>
  );
};
