import { i18nConfig } from './config';
import { type TLocale } from './i18n.models';
import { cookies, headers as getServerHeaders } from 'next/headers';

const { locales, defaultLocale } = i18nConfig;

// --------------------
// Server-side helpers
// --------------------

export async function getLocaleFromCookie(): Promise<TLocale | null> {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value;
  return locales.includes(lang as TLocale) ? (lang as TLocale) : null;
}

export async function getLocaleFromHeaders(): Promise<TLocale> {
  const cookieLang = await getLocaleFromCookie();
  if (cookieLang) return cookieLang;

  const h = await getServerHeaders();
  const acceptLang = h.get('accept-language') ?? '';
  const preferred = acceptLang.split(',').map((lang) => lang.split(';')[0].trim());

  for (const lang of preferred) {
    const baseLang = lang.split('-')[0];
    if (locales.includes(baseLang as TLocale)) return baseLang as TLocale;
  }

  return defaultLocale;
}

export async function getLocaleFromHeadersAsync(): Promise<TLocale> {
  // identical to getLocaleFromHeaders in App Router
  return getLocaleFromHeaders();
}

// --------------------
// Path helpers
// --------------------

export function getLocalizedPath(locale: TLocale | undefined, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withLocale = locale ? `/${locale}${normalized}` : normalized;
  return withLocale.replace(/\/+$/, '') || '/';
}
