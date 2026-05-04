import { del, get, post, put } from '../client';
import type { TSIngleResponse } from '../models/Response.model';
import type {
  TArgumentCreateAsProofBody,
  TArgumentCreateBody,
  TArgumentMultiResponse,
  TArgumentPutBody,
  TArgumentRequestParams,
  TOpinionArgumentsResponse,
  TOpinionArgumentsSubmitBody,
  TOpinionArgumentsSubmitResponse,
} from '../models/Argument.api.models';
import { type TArgument } from '@core/models/Argument.model';
import { type TApproveRefusePagination } from '../models/Pagination.model';
import { type TLocaleHeader } from '../models/Locale.api.models';
import { BASIC_POST_CONFIG } from '../api.consts';
import { withAuth } from '../utils/auth.utils';

export class ArgumentApi {
  static getAll(params?: TArgumentRequestParams): Promise<TArgumentMultiResponse> {
    return get('/api/arguments', { params });
  }

  static getById(
    id?: string,
    params?: Partial<TApproveRefusePagination> & TLocaleHeader
  ): Promise<TSIngleResponse<TArgument>> {
    return get(`/api/arguments/${id}`, { params, headers: { 'X-Locale': params?.locale || 'en' } });
  }

  static create(data: TArgumentCreateBody, token?: string | null): Promise<TArgument> {
    return post('/api/arguments', data, withAuth(token));
  }

  static createAsProof(data: TArgumentCreateAsProofBody, token?: string | null): Promise<TArgument> {
    return post('/api/arguments2', data, withAuth(token, BASIC_POST_CONFIG));
  }

  static update(id: string, data: TArgumentPutBody, token?: string | null): Promise<TArgument> {
    return put(`/api/arguments/${id}`, data, withAuth(token));
  }

  static delete(id: string, token?: string | null): Promise<void> {
    return del(`/api/arguments/${id}`, withAuth(token));
  }

  static getOpinionArgumentsByUserId(
    versionId: string,
    userId: string,
    token?: string | null,
    page?: number,
    perPage?: number
  ): Promise<TOpinionArgumentsResponse> {
    const params = new URLSearchParams({ userId });
    if (page !== undefined) params.set('page', String(page));
    if (perPage !== undefined) params.set('perPage', String(perPage));
    return get(`/api/Ashvant2/opinions/${versionId}/flat?${params}`, withAuth(token, BASIC_POST_CONFIG));
  }

  static submitOpinionArguments(
    data: TOpinionArgumentsSubmitBody,
    token?: string | null
  ): Promise<TOpinionArgumentsSubmitResponse> {
    return post(`/api/Ashvant2/opinions/arguments`, data, withAuth(token, BASIC_POST_CONFIG));
  }
}


