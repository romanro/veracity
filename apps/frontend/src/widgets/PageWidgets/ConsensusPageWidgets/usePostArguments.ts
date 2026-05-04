import { ArgumentApi } from '@/core/api/apis/Argument.api';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { type TArgumentCreateAsProofBody } from '@/core/api/models/Argument.api.models';

export const usePostArguments = () => {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationFn: async (params: TArgumentCreateAsProofBody) => {
      if (!isSignedIn) throw new Error('Not authenticated');
      const token = await getToken();
      return ArgumentApi.createAsProof(params, token);
    },
  });
};
