import { useMemo } from 'react';

export const useResolvedImageSrc = (src: string): string => {
  return useMemo(() => {
    const devBaseUrl = process.env.NEXT_HTTP_URL;
    if (
      process.env.NODE_ENV === 'development' &&
      devBaseUrl &&
      typeof src === 'string' &&
      src.startsWith('/') &&
      !src.startsWith('//')
    ) {
      return `${devBaseUrl}${src}`;
    }
    return src;
  }, [src]);
};
