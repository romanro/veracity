import type { AxiosRequestConfig } from 'axios';

/**
 * Creates authorization headers for API requests using Clerk tokens
 * @param token - The token from Clerk's getToken() method
 * @returns Headers object with Authorization header if token exists
 */
export const createAuthHeaders = (token?: string | null) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Merges authorization headers with existing config headers
 * @param token - The token from Clerk's getToken() method
 * @param config - Existing Axios request config
 * @returns Updated config with authorization headers
 */
export const withAuth = (token?: string | null, config: AxiosRequestConfig = {}): AxiosRequestConfig => {
  return {
    ...config,
    headers: {
      ...config.headers,
      ...createAuthHeaders(token),
    },
  };
};

/**
 * Type helper for API methods that require authentication
 */
export interface AuthenticatedApiMethod {
  token?: string | null;
}