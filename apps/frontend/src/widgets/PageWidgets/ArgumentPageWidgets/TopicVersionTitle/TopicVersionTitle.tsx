import { Card } from '@libs/ui-components/Card';
import Link from 'next/link';
import { type FC } from 'react';

type TTopicVersionTitleProps = {
  topicTitle?: string;
  versionTitle?: string;
  locale?: string;
  topicId?: string;
  versionId?: string;
};
export const TopicVersionTitle: FC<TTopicVersionTitleProps> = ({
  topicTitle,
  versionTitle,
  locale,
  topicId,
  versionId,
}) => {
  if (!topicTitle && !versionTitle) {
    return null;
  }

  const topicHref = `/${locale}/topics/${topicId}`;
  const versionHref = `/${locale}/topics/${topicId}/versions/${versionId}/consensus`;

  return (
    <Card className='mt-4 !rounded-b-none'>
      <div className='max-w-full space-y-2 p-3'>
        <Link href={topicHref} className='flex gap-4'>
          <div className='min-w-[4rem] whitespace-nowrap text-(--color-text-secondary)'>Topic</div>
          <h2 className='truncate'>{topicTitle}</h2>
        </Link>
        <Link href={versionHref} className='flex gap-4'>
          <div className='min-w-[4rem] whitespace-nowrap text-(--color-text-secondary)'>Version</div>
          <h2 className='truncate'>{versionTitle}</h2>
        </Link>
      </div>
    </Card>
  );
};
