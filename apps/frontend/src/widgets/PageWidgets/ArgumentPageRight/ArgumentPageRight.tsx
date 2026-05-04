'use client';

import { useEffect, useState, type FC } from 'react';
import { Card } from '@libs/ui-components/Card';
import { type TArgumentPageRightProps } from './ArgumentPageRight.models';
import { ArgumentTitleRight } from '../ArgumentPageWidgets/ArgumentTitleRight';
import { getTABARGUMENTSEARCH } from '../ArgumentPageWidgets/ArgumentTabs';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '@/libs/hooks/useQueryParams';
import { useInfiniteArguments } from '../ConsensusPageWidgets/useGetArguments';
import { ArgumentsSearchList } from '@/widgets/Arguments/ArgumentsSearchList';
import { Tabs } from '@/libs/ui-components/Tabs';
import { useTabSelection } from '@/libs/hooks/useTabSelection/useTabSelection';
import { type TTab } from '@/libs/ui-components/Tabs/Tabs.models';
import { useUser } from '@clerk/nextjs';
import { getParamsSearchArgumentsTabs } from '../ArgumentPageWidgets/ArgumentTabs/ArgumentTabs.utils';
import { type TArgumentTabsGetParams } from '../ArgumentPageWidgets/ArgumentTabs/ArgumentTabs.models';
import { type TArgument } from '@/core/models/Argument.model';
import { useDispatch } from 'react-redux';
import { addArgument } from '@/store/argumentsSlice';
import { FetchNextPageButton } from '@/libs/ui-components/FetchNextPageButton';
import { QuoteSearch } from '../NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/QuoteLibrary/QuoteSearch/QuoteSearch';

export const ArgumentPageRight: FC<TArgumentPageRightProps> = ({ mainParams, onItemDropped, droppedItemId }) => {
  const dispatch = useDispatch();
  const { topicId } = mainParams;
  const { user } = useUser();

  const { t } = useTranslation('searchPage');
  const TABARGUMENTSEARCH = getTABARGUMENTSEARCH(t);

  const { getParam, setParam } = useQueryParams();

  const currentSearch = getParam('searchArgument') ?? '';
  const { selected, onTabSelected, tabs } = useTabSelection<TTab>(TABARGUMENTSEARCH);
  const [argumentsSearchList, setArgumentsSearchList] = useState<TArgument[]>([]);
  const { data, isLoading, isRefetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteArguments({
    search: currentSearch || null,
    perPage: 13,
    sortDirection: 'asc',
    sortArgument: 'veracity',
    ...getParamsSearchArgumentsTabs({
      id: selected,
      topicId: topicId as string,
      userId: user?.id || '',
    } as TArgumentTabsGetParams),
  });

  useEffect(() => {
    if (data?.pages) {
      const loaded = data.pages.flatMap((p) => p.arguments.data ?? []);
      setArgumentsSearchList(loaded);
    }
  }, [data]);

  useEffect(() => {
    if (droppedItemId) {
      setArgumentsSearchList((prev) => prev.filter((arg) => arg.id !== droppedItemId));

      if (onItemDropped) {
        onItemDropped(droppedItemId);
      }
    }
  }, [droppedItemId, onItemDropped]);

  const onSearch = (searchText: string) => {
    setParam('searchArgument', searchText);
  };

  const onClickReuse = (item: TArgument) => {
    dispatch(addArgument(item));
    setArgumentsSearchList((prev) => prev.filter((arg) => arg.id !== item.id));
  };

  return (
    <Card className='m-1 flex h-screen w-[40%] flex-col flex-nowrap overflow-y-scroll p-2 pb-24 text-center whitespace-nowrap'>
      <ArgumentTitleRight />
      <QuoteSearch initialValue={currentSearch} onSearch={onSearch} />

      <Tabs tabs={tabs} onTabSelected={onTabSelected} initiallySelected={selected} />
      <div>
        <ArgumentsSearchList
          data={argumentsSearchList}
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
      </div>
    </Card>
  );
};
