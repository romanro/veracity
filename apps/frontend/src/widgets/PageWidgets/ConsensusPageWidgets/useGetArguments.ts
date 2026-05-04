import { ArgumentApi } from '@/core/api/apis/Argument.api';
import { type TArgumentMultiResponse, type TArgumentRequestParams } from '@/core/api/models/Argument.api.models';
import {
  keepPreviousData,
  type QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useArgumentSearchParams } from './useArgumentSearchParams';
import { useEffect, useRef } from 'react';

export const useGetArguments = (params: TArgumentRequestParams) => {
  return useQuery({
    queryKey: ['arguments', { ...params }],
    queryFn: () => ArgumentApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
};

export type UseInfiniteArgumentsParams = Omit<TArgumentRequestParams, 'page'> & {
  perPage?: number;
  topicId?: null | string | number;
  userId?: string | number;
};

export const useInfiniteArguments = (params: UseInfiniteArgumentsParams) => {
  const perPage = params.perPage ?? 10;

  const { userId = params.userId } = useArgumentSearchParams();

  const queryClient = useQueryClient();
  const prevUserId = useRef(userId);

  useEffect(() => {
    if (prevUserId.current !== userId) {
      prevUserId.current = userId;
      queryClient.removeQueries({
        queryKey: ['arguments'],
        exact: false,
      });
    }
  }, [userId, queryClient]);

  return useInfiniteQuery<TArgumentMultiResponse, Error>({
    queryKey: ['arguments', { ...params, userId, perPage }],
    queryFn: async (context: QueryFunctionContext<readonly unknown[], unknown>) => {
      const page = typeof context.pageParam === 'number' ? context.pageParam : 1;
      return ArgumentApi.getAll({
        ...params,
        page,
        perPage,
        userId,
      });
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.arguments.page;
      const totalPages = lastPage.arguments.pages ?? Math.ceil((lastPage.arguments.total ?? 0) / perPage);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 10_000,
  });
};
