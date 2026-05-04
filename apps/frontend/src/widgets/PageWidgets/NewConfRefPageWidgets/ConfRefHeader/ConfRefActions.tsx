'use client';

import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RoundedButton } from '@libs/ui-components/Buttons/RoundedButton';
import { useConfRefPublish } from './useConfRefPublish';
import { type TConfRefActionsProps } from './ConfRefHeader.models';

export const ConfRefActions: FC<TConfRefActionsProps> = memo(
  ({ isApprove, isTreeValid, argumentsListRef, argumentId, topicId, versionId, onCancel }) => {
    const { t } = useTranslation('argumentPage');
    const { onPublish, isPending } = useConfRefPublish({
      argumentsListRef,
      argumentId,
      topicId,
      versionId,
      isApprove,
    });

    return (
      <footer className='flex items-center gap-4'>
        <RoundedButton onClick={onPublish} disabled={!isTreeValid || isPending}>
          {isPending
            ? t('publishing', { ns: 'newOpinionPage' }) || 'Publishing...'
            : isApprove
              ? t('publishConfirmation')
              : t('publishRefutation')}
        </RoundedButton>
        <RoundedButton variant='outlined' onClick={onCancel} disabled={isPending}>
          {t('buttonCancel')}
        </RoundedButton>
      </footer>
    );
  }
);

ConfRefActions.displayName = 'ConfRefActions';
