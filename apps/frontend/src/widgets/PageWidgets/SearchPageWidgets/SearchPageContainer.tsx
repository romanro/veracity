'use client';

import { SearchField } from '@libs/ui-components/SearchField';
import { type FC } from 'react';
import { useInfiniteTopicsSearch } from './useTopicsSearch';
import { TopicsList } from '@widgets/TopicsList/TopicsList';
import { useQueryParams } from '@libs/hooks/useQueryParams';
import { useTranslation } from 'react-i18next';
import { CONTAINER_CLASSES } from '@/app/styles/tailwind/container.consts';
import { FetchNextPageButton } from '@/libs/ui-components/FetchNextPageButton';

export const SearchPageContainer: FC = () => {
  const { t } = useTranslation('searchPage');
  const { getParam, setParam } = useQueryParams();
  const currentSearch = getParam('search') ?? '';

  const { data, isLoading, isRefetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteTopicsSearch({
    search: currentSearch,
    perPage: 5,
  });
  const topics = data?.pages.flatMap((page) => page.data) ?? [];
  const onSearch = (searchText: string) => {
    setParam('search', searchText);
  };

  return (
    <>
      <section className={CONTAINER_CLASSES}>
        <SearchField
          placeholder={t('searchLongPromt')}
          buttonLabel={t('find')}
          initialValue={currentSearch}
          onSearch={onSearch}
        />
        <TopicsList data={topics} isLoading={isLoading || isRefetching} />
        <FetchNextPageButton
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </section>
    </>
  );
};
