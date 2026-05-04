'use client';

import { SSRReactQueryProvider } from '@core/providers/ReactQueryProvider/SSRReactQueryProvider';
import { type DehydratedState } from '@tanstack/react-query';
import { useMemo, type FC } from 'react';
import { useGetTopic } from '../TopicPageWidgets/useGetTopic';
import { useTranslation } from 'react-i18next';
import { type TVersion } from '@/core/models/Version.model';
import { useInfiniteArguments } from './useGetArguments';
import dynamic from 'next/dynamic';
import { ShimmerPlaceholder } from '@/libs/ui-components/ShimmerPlaceholder';
import { ArgumentsTabs } from '@widgets/ArgumentsTabs';
import { VersionsSideMenu } from '@widgets/VersionsSideMenu';
import { AuthorsSideMenu } from '@/widgets/AuthorsSideMenu';

const VersionView = dynamic(() => import('@widgets/VersionView').then((mod) => mod.VersionView), {
  loading: () => <ShimmerPlaceholder height={320} />,
  ssr: true,
});

const NewOpinionInput = dynamic(() => import('@/widgets/NewOpinionInput').then((mod) => mod.NewOpinionInput), {
  loading: () => <ShimmerPlaceholder height={60} />,
  ssr: false,
});

type TConsensusPageContainerProps = { topicId?: string; versionId?: string; dehydratedState: DehydratedState };
export const ConsensusPageContainer: FC<TConsensusPageContainerProps> = ({ topicId, versionId, dehydratedState }) => {
  const { data: topic } = useGetTopic({ topicId });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteArguments({
    versionId,
    perPage: 5,
  });

  const { t } = useTranslation('consensusPage');

  const versionIndex = useMemo(() => {
    return topic?.versions?.findIndex((v) => v.id == versionId) ?? 0;
  }, [topic, versionId]);

  const allArguments = data?.pages.flatMap((page) => page.arguments.data) ?? [];
  const version = data?.pages[0]?.version ?? null;

  const { authors } = version ?? {};

  return (
    <SSRReactQueryProvider dehydratedState={dehydratedState}>
      {topic && (
        <h6 className='mb-4 block text-center text-sm text-(--color-secondary-text)'>
          {`${t('version')} ${versionIndex + 1}`}
        </h6>
      )}

      <section className='flex flex-col gap-4'>
        <VersionView isLoading={isLoading} version={version as TVersion} />
        <NewOpinionInput />
         <ArgumentsTabs
          isLoading={isLoading}
          args={allArguments}
          authors={authors}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          versionId={versionId}
        />
      </section>
      {topic?.versions && <VersionsSideMenu versions={topic?.versions} versionIndex={versionIndex} />}
      {authors && <AuthorsSideMenu authors={authors} />}
    </SSRReactQueryProvider>
  );
};
