import { useMemo } from 'react';
import type { TArgument } from '../../../../../../../core/models/Argument.model';
import { getParamsSearchArgumentsTabs } from '../../../../../ArgumentPageWidgets/ArgumentTabs/ArgumentTabs.utils';
import { useInfiniteArguments } from '../../../../../ConsensusPageWidgets/useGetArguments';
import type { TQuoteArgumentsListProps } from './QuoteArgumentsList.models';

type TUseFilterArgumentsParams = TQuoteArgumentsListProps & { filterArguments?: TArgument[] };

export const useFilterArguments = ({
  search,
  id,
  topicId,
  userId,
  filterArguments = [],
}: TUseFilterArgumentsParams) => {
  const { data, isLoading, isRefetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteArguments({
    search,
    perPage: 13,
    sortDirection: 'asc',
    sortArgument: 'veracity',
    ...getParamsSearchArgumentsTabs({
      id,
      topicId: topicId as string,
      userId,
    }),
  });

  const loaded: TArgument[] = useMemo(() => data?.pages?.flatMap((p) => p.arguments.data ?? []) || [], [data]);

  const filteredArguments: TArgument[] = useMemo(() => {
    const usedArgumentIds = filterArguments.map(arg => arg.id);
    return loaded.filter((arg) => !usedArgumentIds.includes(arg.id)) || [];
  }, [loaded, filterArguments]);

  return { filteredArguments, isLoading, isRefetching, isFetchingNextPage, hasNextPage, fetchNextPage };
};
