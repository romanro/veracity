'use client';

import { I18nextProvider } from 'react-i18next';
import i18n, { bootstrapI18n } from '@/i18n/clientInit';
import { type Resource } from 'i18next';
import { type ReactNode } from 'react';

interface I18nProviderProps {
  locale: string;
  resources: Resource;
  children: ReactNode;
}

export function I18nProvider({ locale, resources, children }: I18nProviderProps) {
  bootstrapI18n(locale, resources);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
