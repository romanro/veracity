import { useInfiniteQuery, useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { ArgumentApi } from '@/core/api/apis/Argument.api';
import { useAuth } from '@clerk/nextjs';
import type { TOpinionArgumentsResponse } from '@core/api/models/Argument.api.models';

type TUseGetOpinionArgumentsParams = {
  versionId: string;
  userId?: string;
};

export const useGetOpinionArguments = ({ versionId, userId }: TUseGetOpinionArgumentsParams) => {
  const { getToken, isSignedIn } = useAuth();

  return useQuery<TOpinionArgumentsResponse>({
    queryKey: ['opinionArguments', versionId, userId],
    queryFn: async () => {
      if (!isSignedIn) throw new Error('Not authenticated');
      if (!userId) throw new Error('User ID is required');
      const token = await getToken();
      return ArgumentApi.getOpinionArgumentsByUserId(versionId, userId, token, 1, 5000);
    },
    enabled: isSignedIn && !!userId && !!versionId,
  });
};

export type TUseInfiniteOpinionArgumentsParams = {
  versionId: string;
  userId?: string;
  perPage?: number;
};

export const useInfiniteOpinionArguments = ({
  versionId,
  userId,
  perPage = 20,
}: TUseInfiniteOpinionArgumentsParams) => {
  const { getToken, isSignedIn } = useAuth();

  return useInfiniteQuery<TOpinionArgumentsResponse, Error>({
    queryKey: ['opinionArguments', versionId, userId, { perPage }],
    queryFn: async (context: QueryFunctionContext) => {
      if (!isSignedIn) throw new Error('Not authenticated');
      if (!userId) throw new Error('User ID is required');
      const page = typeof context.pageParam === 'number' ? context.pageParam : 1;
      const token = await getToken();
      return ArgumentApi.getOpinionArgumentsByUserId(versionId, userId, token, page, perPage);
    },
    getNextPageParam: (lastPage) => {
      const current = lastPage.arguments.page;
      const total = lastPage.arguments.pages ?? Math.ceil((lastPage.arguments.total ?? 0) / perPage);
      return current < total ? current + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: isSignedIn && !!userId && !!versionId,
  });
};
