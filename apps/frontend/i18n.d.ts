import 'i18next';

declare module 'i18next' {
  interface Resources {
    common: {};
    mainPage: {};
    searchPage: {
      search: string;
      find: string;
      searchLongPromt: string;
    };
  }
}
