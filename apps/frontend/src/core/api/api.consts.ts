import type { AxiosRequestConfig } from 'axios';

export const KEY_ACCESS_TOKEN = 'accessToken';

export const BASIC_POST_CONFIG: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
};
