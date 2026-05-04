import type { TUserProfileBody, TUserProfileResponse } from '../models/Profile.api.models';
import { get, post } from '../client';
import { withAuth } from '../utils/auth.utils';

export class ProfileApi {
  static async getCurrentUser(token?: string | null): Promise<TUserProfileResponse> {
    return get('/api/v1/profile', withAuth(token));
  }

  static async updateCurrentUser(data: TUserProfileBody, token?: string | null): Promise<TUserProfileResponse> {
    return post<TUserProfileResponse>('/api/v1/profile', data, withAuth(token));
  }
}
