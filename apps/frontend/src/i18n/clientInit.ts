import i18next, { type Resource } from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { i18nConfig } from './config';

let initialized = false;

export function bootstrapI18n(locale: string, resources: Resource) {
  if (initialized) {
    if (i18next.language !== locale) {
      i18next.changeLanguage(locale);
    }
    for (const [lng, namespaces] of Object.entries(resources)) {
      for (const [ns, bundle] of Object.entries(namespaces as Record<string, object>)) {
        if (!i18next.hasResourceBundle(lng, ns)) {
          i18next.addResourceBundle(lng, ns, bundle);
        }
      }
    }
    return;
  }

  initialized = true;

  i18next
    .use(initReactI18next)
    .use(Backend)
    .init({
      lng: locale,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      ns: i18nConfig.ns,
      defaultNS: i18nConfig.defaultNS,
      resources,
      partialBundledLanguages: true,
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

if (!initialized) {
  initialized = true;
  i18next
    .use(initReactI18next)
    .use(Backend)
    .init({
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      ns: i18nConfig.ns,
      defaultNS: i18nConfig.defaultNS,
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18next;
