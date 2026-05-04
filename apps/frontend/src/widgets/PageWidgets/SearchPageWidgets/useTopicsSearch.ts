import { TopicApi } from '@/core/api/apis/Topic.api';
import type { TSearchParams } from '@/core/api/models/Pagination.model';
import type { TMultiResponse } from '@/core/api/models/Response.model';
import type { TTopic } from '@/core/models/Topic.model';
import { keepPreviousData, type QueryFunctionContext, useInfiniteQuery, useQuery } from '@tanstack/react-query';

type TUseTopicsSearchParams = TSearchParams;

export const useTopicsSearch = ({
  search = '',
  page = 1,
  perPage = 10,
  orderDirection,
  orderBy,
}: TUseTopicsSearchParams) => {
  return useQuery({
    queryKey: ['topics', { search, page, perPage, orderDirection, orderBy }],
    queryFn: () => TopicApi.getAll({ search, page, perPage, orderDirection, orderBy }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
};

export const useInfiniteTopicsSearch = ({
  search = '',
  perPage = 5,
  orderDirection,
  orderBy,
}: TUseTopicsSearchParams) => {
  return useInfiniteQuery<TMultiResponse<TTopic>, Error>({
    queryKey: ['topics', { search, perPage, orderDirection, orderBy }],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
      return TopicApi.getAll({
        search,
        page: pageParam as number,
        perPage,
        orderDirection,
        orderBy,
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, pages = 1 } = lastPage;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 10_000,
  });
};
