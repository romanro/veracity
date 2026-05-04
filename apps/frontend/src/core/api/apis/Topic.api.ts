import type { TTopic } from '@/core/models/Topic.model';
import { del, get, post, put } from '../client';
import { type TMultiResponse, type TSIngleResponse } from '../models/Response.model';
import { type TSearchParams } from '../models/Pagination.model';
import { type TLocaleHeader } from '../models/Locale.api.models';
import { withAuth } from '../utils/auth.utils';

export class TopicApi {
  static getAll(params?: TSearchParams): Promise<TMultiResponse<TTopic>> {
    return get('/api/topics', { params });
  }

  static getById(id?: string, params?: TLocaleHeader): Promise<TSIngleResponse<TTopic>> {
    return get(`/api/topics/${id}`, { headers: { 'X-Locale': params?.locale || 'en' } });
  }

  static create(data: Partial<TTopic>, token?: string | null): Promise<TTopic> {
    return post('/api/topics', data, withAuth(token));
  }

  static update(id: string, data: Partial<TTopic>, token?: string | null): Promise<TTopic> {
    return put(`/api/topics/${id}`, data, withAuth(token));
  }

  static delete(id: string, token?: string | null): Promise<void> {
    return del(`/api/topics/${id}`, withAuth(token));
  }
}
