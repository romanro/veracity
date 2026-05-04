'use client';
import { type FC } from 'react';
import { useGetTopic } from './useGetTopic';
import { VersionsList } from '@widgets/VersionsList';
import { type DehydratedState } from '@tanstack/react-query';
import { SSRReactQueryProvider } from '@core/providers/ReactQueryProvider/SSRReactQueryProvider';
import { TopicPageButtons } from './TopicPageButtons/TopicPageButtons';

type TTopicPageContainerProps = { topicId: string; dehydratedState: DehydratedState };

export const TopicPageContainer: FC<TTopicPageContainerProps> = ({ topicId, dehydratedState }) => {
  const { isLoading, data } = useGetTopic({ topicId });

  const { versions = [] } = data || {};

  return (
    <SSRReactQueryProvider dehydratedState={dehydratedState}>
      <TopicPageButtons />
      <div className='pb-12'>
        <VersionsList isLoading={isLoading} versions={versions} />
      </div>
    </SSRReactQueryProvider>
  );
};
