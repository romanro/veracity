import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import fs from 'fs';
import path from 'path';
import { i18nConfig } from './config';

const LOCALES_SUBPATH = path.join('public', 'locales');

/**
 * Resolve the directory containing locale JSON files.
 * Works in development (project root) and in standalone (cwd or .next/standalone).
 */
function resolveLocalesDir(): string {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, LOCALES_SUBPATH),
    path.join(cwd, '.next', 'standalone', LOCALES_SUBPATH),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  return path.join(cwd, LOCALES_SUBPATH);
}

export async function initServerI18n(locale: string) {
  const instance = i18next.createInstance();
  const localesDir = resolveLocalesDir();
  const loadPath = path.join(localesDir, '{{lng}}', '{{ns}}.json');

  await instance.use(Backend).init({
    lng: locale,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    ns: i18nConfig.ns,
    defaultNS: 'common',
    backend: {
      loadPath,
    },
    interpolation: {
      escapeValue: false,
    },
  });

  return instance;
}

/**
 * Load all translation resources for a locale as a plain object
 * suitable for passing across the server→client boundary.
 */
export async function getServerTranslations(locale: string): Promise<Record<string, Record<string, object>>> {
  const localesDir = resolveLocalesDir();
  const resources: Record<string, Record<string, object>> = { [locale]: {} };

  for (const ns of i18nConfig.ns) {
    const filePath = path.join(localesDir, locale, `${ns}.json`);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      resources[locale][ns] = JSON.parse(content);
    } catch {
      resources[locale][ns] = {};
    }
  }

  return resources;
}
