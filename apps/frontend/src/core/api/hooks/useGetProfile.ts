import { useQuery } from '@tanstack/react-query';
import { ProfileApi } from '../apis/Profile.api';
import { useAuth } from '@clerk/nextjs';
import type { TUserProfileResponse } from '../models/Profile.api.models';

export const useGetProfile = () => {
  const { getToken, isSignedIn } = useAuth();

  return useQuery<TUserProfileResponse>({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!isSignedIn) throw new Error('Not authenticated');
      const token = await getToken();
      return ProfileApi.getCurrentUser(token);
    },
    enabled: isSignedIn,
  });
};
