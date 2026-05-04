import axios, { type AxiosRequestConfig, type Method } from 'axios';
import { KEY_ACCESS_TOKEN } from './api.consts';
import { getCookie } from '../utils/cookies/getCookie';

// Store the token getter function
let tokenGetter: (() => Promise<string | null>) | null = null;

// Basic client for making API requests
const baseApi = axios.create({
  baseURL: process.env.NEXT_HTTP_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Set the token getter from your components
export const setTokenGetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
};

// Interceptor: adding Authorization
baseApi.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    config.headers = config.headers || {};

    const lang = getCookie('lang'); // read lang from cookie
    if (lang) {
      config.headers['X-Locale'] = lang;
    }

    const accessToken = localStorage.getItem(KEY_ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Automatically get token if tokenGetter is available
    if (tokenGetter) {
      try {
        const token = await tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    }
  }
  return config;
});

// Interceptor errors handling (ex, 401)
baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn('Unauthorized. Redirecting to login...');
      // window.location.href = '/login'
    }

    return Promise.reject(error);
  }
);

// 🌐 Send method
export const send = async <TResponse>(
  url: string,
  method: Method,
  config: AxiosRequestConfig = {}
): Promise<TResponse> => {
  const response = await baseApi.request<TResponse>({
    url,
    method,
    ...config,
  });

  return response.data;
};

// 🎯 Unified methods
export function get<TResponse>(url: string, config?: AxiosRequestConfig) {
  return send<TResponse>(url, 'GET', config);
}

export function post<TResponse>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  return send<TResponse>(url, 'POST', { data, ...config });
}

export function put<TResponse>(url: string, data: unknown, config?: AxiosRequestConfig) {
  return send<TResponse>(url, 'PUT', { data, ...config });
}

export function del<TResponse>(url: string, config?: AxiosRequestConfig) {
  return send<TResponse>(url, 'DELETE', config);
}
