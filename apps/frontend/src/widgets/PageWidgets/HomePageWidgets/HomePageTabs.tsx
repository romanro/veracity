'use client';
import { CONTAINER_CLASSES, CONTAINER_XL_CLASSES } from '@/app/styles/tailwind/container.consts';
import { type TTab } from '@libs/ui-components/Tabs/Tabs.models';
import { useMemo, type FC } from 'react';
import { useInfiniteTopicsSearch } from '../SearchPageWidgets/useTopicsSearch';
import { getParamsByTabId, getTabsLayout, TABSHOME } from './HomePageTabs.utils';
import { useTranslation } from 'react-i18next';
import { FetchNextPageButton } from '@libs/ui-components/FetchNextPageButton';
import { useTabSelection } from '@/libs/hooks/useTabSelection/useTabSelection';
import { Tabs, TopicsList } from './HomePageTabs.lazy';

export const HomePageTabs: FC = () => {
  const { selected, onTabSelected } = useTabSelection<TTab>(TABSHOME);
  const { t } = useTranslation('mainPage');

  const { data, isLoading, isRefetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteTopicsSearch({
    perPage: 5,
    ...getParamsByTabId(selected),
  });
  const topics = data?.pages.flatMap((page) => page.data) ?? [];

  const translatedTabs = useMemo(() => TABSHOME.map((tab) => ({ ...tab, label: t(tab.label as string) })), [t]);

  const columns = useMemo(() => getTabsLayout(selected), [selected]);

  return (
    <>
      <section className={CONTAINER_CLASSES}>
        <Tabs tabs={translatedTabs} onTabSelected={onTabSelected} initiallySelected={selected} />
      </section>
      <section className={columns > 1 ? CONTAINER_XL_CLASSES : CONTAINER_CLASSES}>
        <TopicsList data={topics} isLoading={isLoading || isRefetching} columns={columns} />
        <FetchNextPageButton
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </section>
    </>
  );
};
