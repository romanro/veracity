'use client';

import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@libs/ui-components/Card';
import { ConfRefActions } from './ConfRefActions';
import { ConfRefArgumentSummary } from './ConfRefArgumentSummary';
import { type TConfRefHeaderProps } from './ConfRefHeader.models';

export const ConfRefHeader: FC<TConfRefHeaderProps> = memo(
  ({ argument, topic, version, type, isTreeValid, argumentsListRef, argumentId, topicId, versionId, onCancel }) => {
    const { t } = useTranslation('argumentPage');
    const isApprove = type === 'approve';

    return (
      <Card className='flex flex-col gap-[16px] !p-[24px]'>
        <h2 className='cardHeader'>{isApprove ? t('confirmArgument') : t('refuteArgument')}</h2>
        <ConfRefArgumentSummary argument={argument} topic={topic} version={version} />
        <ConfRefActions
          isApprove={isApprove}
          isTreeValid={isTreeValid}
          argumentsListRef={argumentsListRef}
          argumentId={argumentId}
          topicId={topicId}
          versionId={versionId}
          onCancel={onCancel}
        />
      </Card>
    );
  }
);

ConfRefHeader.displayName = 'ConfRefHeader';
