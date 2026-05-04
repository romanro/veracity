'use client';

import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ArgumentSummaryHeader } from '../../../ArgumentsList/ArgumentSummary/ArgumentSummaryHeader';
import { type TConfRefArgumentSummaryProps } from './ConfRefHeader.models';

export const ConfRefArgumentSummary: FC<TConfRefArgumentSummaryProps> = memo(({ argument, topic, version }) => {
  const { t } = useTranslation('common');
  const author = argument?.authors?.[0] ?? argument?.author;

  return (
    <div className='flex flex-col gap-[12px] rounded-[20px] border-[1px] border-(--color-gray-warm-200) p-[16px]'>
      <ArgumentSummaryHeader author={author} createdDate={argument?.createdDate ?? ''} />
      <article className='flex flex-col gap-[12px] pl-[30px]'>
        {(topic?.title || version?.title) && (
          <div className='flex flex-col gap-1 text-sm text-(--color-text-secondary)'>
            {topic?.title && (
              <span className='break-words'>
                {t('topicName')} {topic.title}
              </span>
            )}
            {version?.title && (
              <span className='break-words'>
                {t('versionName')} {version.title}
              </span>
            )}
          </div>
        )}

        {argument?.title && <p className='text-base break-words'>{argument.title}</p>}
      </article>
    </div>
  );
});

ConfRefArgumentSummary.displayName = 'ConfRefArgumentSummary';
