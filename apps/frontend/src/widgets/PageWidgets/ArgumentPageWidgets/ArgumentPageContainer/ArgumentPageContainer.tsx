'use client';

import { useTranslation } from 'react-i18next';

import { Card } from '@libs/ui-components/Card';
import { type FC, useMemo } from 'react';
import { ArgumentTabs, getTABS } from '../ArgumentTabs';
import { SSRReactQueryProvider } from '@/core/providers/ReactQueryProvider/SSRReactQueryProvider';
import { OpinionsList } from '@/widgets/OpinionsList';
import { useArgumentSearchParams } from '../../ConsensusPageWidgets/useArgumentSearchParams';
import { type ArgumentTab } from '@/widgets/OpinionsList/useInfiniteOpinions';
import { NewArgumentInput } from '../NewArgumentInput';
import { CommentsTab } from '@/widgets/CommentTab';
import { useLocaleRouter } from '@/libs/hooks/useLocaleRouter';
import { type TArgumentPageContainerProps } from './ArgumentPageContainer.models';

export const ArgumentPageContainer: FC<TArgumentPageContainerProps> = ({ dehydratedState, mainParams }) => {
  const { tabId } = useArgumentSearchParams('approve');
  const { pushLocalePath } = useLocaleRouter();
  const { t } = useTranslation('argumentPage');
  const TABSARGUMENT = useMemo(() => getTABS(t), [t]);

  const onEnterConfirmArgument = () => {
    pushLocalePath(
      `/topics/${mainParams.topicId}/versions/${mainParams.versionId}/arguments/${mainParams.argumentId}/new-conf-ref?type=${tabId}`
    );
  };

  return (
    <SSRReactQueryProvider dehydratedState={dehydratedState}>
      <div className='mb-6 flex flex-col gap-4'>
        <ArgumentTabs items={TABSARGUMENT} activeTab='approve' />
        <NewArgumentInput tab={tabId as ArgumentTab} onEnterConfirm={onEnterConfirmArgument} />
        {tabId !== 'comments' ? (
          <OpinionsList argumentId={mainParams?.argumentId} mode={tabId as ArgumentTab} />
        ) : (
          <Card>
            <CommentsTab />
          </Card>
        )}
      </div>
    </SSRReactQueryProvider>
  );
};
