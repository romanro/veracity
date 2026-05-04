'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { type TLocale } from '@/i18n/i18n.models';
import { i18nConfig } from '@/i18n/config';
import { useGetProfile } from '@/core/api/hooks/useGetProfile';
import { useUpdateProfile } from '@/core/api/hooks/useUpdateProfile';
import i18n from '@/i18n/clientInit';
import { getLocaleFromPath, setLangCookie, updateDocumentLang } from '@/i18n/LocaleManager.client';

let lastSyncedLang: TLocale | null = null;

export function useLocaleSync() {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locale, setLocaleState] = useState<TLocale>(getLocaleFromPath(pathname));
  const { data: userProfile } = useGetProfile();
  const updateUser = useUpdateProfile();

  // Sync locale from URL path
  useEffect(() => {
    const urlLocale = getLocaleFromPath(pathname);
    setLocaleState(urlLocale);
    if (i18n.language !== urlLocale) {
      i18n.changeLanguage(urlLocale);
    }
    updateDocumentLang(urlLocale);
  }, [pathname]);

  // Listen to i18next language changes from outside
  useEffect(() => {
    const onLangChanged = (lng: string) => {
      const newLocale = lng as TLocale;
      setLocaleState(newLocale);
      updateDocumentLang(newLocale);
    };
    i18n.on('languageChanged', onLangChanged);
    return () => {
      i18n.off('languageChanged', onLangChanged);
    };
  }, []);

  // Sync backend user profile language only if changed and not spamming
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      userProfile?.languageCode &&
      locale &&
      locale !== lastSyncedLang &&
      userProfile.languageCode !== locale
    ) {
      lastSyncedLang = locale;
      updateUser.mutate(
        {
          name: userProfile.name,
          email: userProfile.email,
          languageCode: locale,
        },
        {
          onError: () => {
            lastSyncedLang = null; // allow retry on failure
          },
        }
      );
    }
  }, [locale, userProfile, updateUser]);

  // Setter for locale: updates i18n, cookie, URL, state, document lang
  const setLocale = useCallback(
    (newLocale: TLocale) => {
      if (!i18nConfig.locales.includes(newLocale)) return;
      if (newLocale === locale) return;

      i18n.changeLanguage(newLocale);
      setLangCookie(newLocale);

      const segments = pathname.split('/').filter(Boolean);
      if (segments[0] && i18nConfig.locales.includes(segments[0] as TLocale)) {
        segments.shift();
      }
      segments.unshift(newLocale);
      const newPathname = '/' + segments.join('/');
      const fullPath = searchParams ? `${newPathname}?${searchParams.toString()}` : newPathname;

      router.push(fullPath);
      setLocaleState(newLocale);
      updateDocumentLang(newLocale);
    },
    [locale, pathname, router, searchParams]
  );

  return { locale, setLocale };
}
