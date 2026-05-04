import { i18nConfig } from './config';
import { type TLocale } from './i18n.models';

const { locales, defaultLocale } = i18nConfig;
// --------------------
// Client-side helpers
// --------------------

export function getLocaleFromPath(pathname: string): TLocale {
  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  return locales.includes(maybeLocale as TLocale) ? (maybeLocale as TLocale) : defaultLocale;
}

export function setLangCookie(locale: TLocale): void {
  document.cookie = `lang=${locale}; path=/; max-age=31536000`;
}

export function updateDocumentLang(locale: TLocale): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
}
