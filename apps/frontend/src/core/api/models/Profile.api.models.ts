import { type TLocale } from '@/i18n/i18n.models';

export type TUserProfileResponse = {
  id: string | number;
  name: string;
  languageCode: TLocale;
  email: string;
};

export type TUserProfileBody = {
  name: string;
  languageCode: TLocale;
  email: string;
};
