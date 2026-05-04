'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export const useQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = (key: string): string | null => {
    return searchParams.get(key);
  };

  const setParam = (key: string, value: string, options?: { replace?: boolean }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      params.delete(key);
    }

    const newUrl = `?${params.toString()}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    options?.replace ? router.replace(newUrl) : router.push(newUrl);
  };

  const clearParam = (key: string, options?: { replace?: boolean }) => {
    const params = new URLSearchParams(searchParams.toString());
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    params.delete(key);

    const newUrl = `?${params.toString()}`;
    const method = options?.replace ? router.replace : router.push;
    method(newUrl);
  };

  const clearParams = () => {
    router.push('?');
  };

  const getAllParams = (): Record<string, string> => {
    const obj: Record<string, string> = {};
    for (const [key, val] of searchParams.entries()) {
      obj[key] = val;
    }
    return obj;
  };

  return {
    getParam,
    setParam,
    clearParam,
    clearParams,
    all: searchParams,
    getAllParams,
  };
};
