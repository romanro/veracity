'use client';
import { useRouter } from 'next/navigation';
import { useLocaleSync } from '../useLocaleSync';

export const useLocaleRouter = () => {
  const router = useRouter();
  const { locale, setLocale } = useLocaleSync();

  const getLocalizedPath = (path: string): string => {
    const normalized = path.startsWith('/') ? path : `/${path}`;

    const withLocale = locale ? `/${locale}${normalized}` : normalized;

    return withLocale.replace(/\/+$/, '') || '/';
  };

  const pushLocalePath = (path: string, query?: Record<string, string>) => {
    const fullPath = getLocalizedPath(path);
    if (query) {
      const url = new URL(fullPath, 'http://dummy');
      Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
      router.push(url.pathname + url.search);
    } else {
      router.push(fullPath);
    }
  };

  return {
    locale,
    setLocale,
    getLocalizedPath,
    pushLocalePath,
  };
};
