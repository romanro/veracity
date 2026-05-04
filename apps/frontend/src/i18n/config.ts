export const i18nConfig = {
  locales: ['en', 'ru', 'es'],
  defaultLocale: 'en',
  ns: ['common', 'metadata', 'mainPage', 'topicVersion', 'searchPage', 'searchArguments', 'consensusPage', 'argumentPage', 'newOpinionPage'],
  defaultNS: 'common',
  languages: [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ],
} as const;
