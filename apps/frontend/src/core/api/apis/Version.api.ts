import { type TVersion } from '@/core/models/Version.model';
import { del, get, post, put } from '../client';
import type { TMultiResponse, TSIngleResponse } from '../models/Response.model';
import { type TSearchParams } from '../models/Pagination.model';
import { type TLocaleHeader } from '../models/Locale.api.models';
import { withAuth } from '../utils/auth.utils';

export class VersionsApi {
  static getAll(params?: TSearchParams): Promise<TMultiResponse<TVersion>> {
    return get('/api/versions', { params });
  }

  static getById(id?: string, params?: TLocaleHeader): Promise<TSIngleResponse<TVersion>> {
    return get(`/api/versions/${id}`, { headers: { 'X-Locale': params?.locale || 'en' } });
  }

  static create(data: Partial<TVersion>, token?: string | null): Promise<TVersion> {
    return post('/api/versions', data, withAuth(token));
  }

  static update(id: string, data: Partial<TVersion>, token?: string | null): Promise<TVersion> {
    return put(`/api/versions/${id}`, data, withAuth(token));
  }

  static delete(id: string, token?: string | null): Promise<void> {
    return del(`/api/versions/${id}`, withAuth(token));
  }
}
