import { FetchNextPageButton } from '@libs/ui-components/FetchNextPageButton';
import { ArgumentsSearchList } from '../../../../../../Arguments/ArgumentsSearchList';
import { type FC, type MouseEvent } from 'react';
import type { TArgument } from '@core/models/Argument.model';

import type { TQuoteArgumentsListProps } from './QuoteArgumentsList.models';
import { useFilterArguments } from './useFilterArguments';

export const QuoteArgumentsList: FC<TQuoteArgumentsListProps> = ({
  search,
  id,
  topicId,
  userId,
  usedArguments = [],
  onArgumentReuse,
}) => {
  const { filteredArguments, isLoading, isRefetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFilterArguments({ search, id, topicId, userId, filterArguments: usedArguments });

  const onClickReuse = (item: TArgument, event?: MouseEvent<HTMLButtonElement>) => {
    if (event && onArgumentReuse) {
      const buttonElement = event.currentTarget;
      onArgumentReuse(item, buttonElement);
    }
  };

  return (
    <>
      <ArgumentsSearchList
        data={filteredArguments}
        isLoading={isLoading || isRefetching}
        onContextMenu={false}
        showContextMenu={() => {}}
        onClick={onClickReuse}
      />
      <FetchNextPageButton
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};
