import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { ArgumentApi } from '../apis/Argument.api';
import type { TOpinionArgumentsSubmitBody, TOpinionArgumentsSubmitResponse } from '../models/Argument.api.models';

type TSubmitOpinionArgumentsParams = {
  data: TOpinionArgumentsSubmitBody;
};

export const useSubmitOpinionArguments = () => {
  const { getToken, isSignedIn } = useAuth();
  //  const queryClient = useQueryClient();

  return useMutation<TOpinionArgumentsSubmitResponse, Error, TSubmitOpinionArgumentsParams>({
    mutationFn: async ({ data }: TSubmitOpinionArgumentsParams) => {
      if (!isSignedIn) throw new Error('Not authenticated');
      const token = await getToken();
      return ArgumentApi.submitOpinionArguments( data, token);
    },
    onSuccess: (_response) => {
      // Invalidate relevant queries to refresh data
      //queryClient.invalidateQueries({ queryKey: ['arguments'] });
      // queryClient.invalidateQueries({ queryKey: ['opinions'] });
    },
    onError: (error) => {
      console.error('Failed to submit opinion arguments:', error);
    },
  });
};
