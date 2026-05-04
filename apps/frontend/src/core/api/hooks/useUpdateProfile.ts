import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import type { TUserProfileBody, TUserProfileResponse } from '../models/Profile.api.models';
import { ProfileApi } from '../apis/Profile.api';

export const useUpdateProfile = () => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<TUserProfileResponse, unknown, TUserProfileBody>({
    mutationFn: async (data) => {
      if (!isSignedIn) throw new Error('Not authenticated');
      const token = await getToken();
      return ProfileApi.updateCurrentUser(data, token);
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile);
    },
    onError: (error) => {
      console.error('Failed to update profile', error);
    },
  });
};
