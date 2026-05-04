import { ArgumentApi } from '@core/api/apis/Argument.api';
import { type TApproveRefusePagination } from '@core/api/models/Pagination.model';
import { type TOpinionItem } from '@core/models/Opinion.model';
import { useInfiniteQuery } from '@tanstack/react-query';

export type ArgumentTab = 'approve' | 'refuse';

type UseInfiniteOpinionsParams = {
  argumentId?: string | number;
  mode: ArgumentTab;
  perPage?: number;
};

export const useInfiniteOpinions = ({ argumentId, mode, perPage = 10 }: UseInfiniteOpinionsParams) => {
  return useInfiniteQuery<TOpinionItem[], Error>({
    queryKey: ['opinions', argumentId, mode, perPage],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const paginationParams: TApproveRefusePagination = {
        pageApprove: (mode === 'approve' ? pageParam : 1) as number,
        pageRefuse: (mode === 'refuse' ? pageParam : 1) as number,
        perPageAprove: perPage,
        perPageRefuse: perPage,
      };

      const response = await ArgumentApi.getById(argumentId?.toString(), paginationParams);
      const section = mode === 'approve' ? response.approve : response.refuse;
      return (section?.data as TOpinionItem[]) ?? [];
    },
    getNextPageParam: (lastPage, allPages) => {
      // lastPage = current page data array (TOpinionItem[])
      if (lastPage.length < perPage) return undefined; // no more pages

      return allPages.length + 1; // next page number
    },
    staleTime: 10_000,
  });
};
