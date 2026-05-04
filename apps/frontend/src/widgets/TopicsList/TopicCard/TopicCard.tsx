import { type FC } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { type TopicCardProps } from './TopicCard.models';
import { Card } from '@libs/ui-components/Card';
import { ImageLoader } from '@libs/ui-components/ImageLoader';
import { getDisplayedVersion } from './TopicCard.utils';
import { VersionShortSummary } from '@/widgets/VersionSummary/VersionShortSummary';
import { TopicCardHeader } from './TopicCardHeader';
import { TopicCardFooter } from './TopicCardFooter';
import styles from './TopicCard.module.scss';
import { useLocaleRouter } from '@libs/hooks/useLocaleRouter';

export const TopicCard: FC<TopicCardProps> = ({ topic }) => {
  const { getLocalizedPath } = useLocaleRouter();

  if (!topic) {
    return null;
  }

  const { id, srcImg, title, dateCreated, versions, authors, countComments } = topic;

  const { version, index } = getDisplayedVersion(versions);

  return (
    <Card className={classNames(styles.topicCard)}>
      {srcImg && (
        <ImageLoader src={srcImg} alt={title} width={668} height={200} unoptimized className={styles.image} fill />
      )}
      <div className={styles.cardContent}>
        <Link href={getLocalizedPath(`/topics/${id}`)} className='flex flex-col gap-4'>
          <TopicCardHeader title={title} dateCreated={dateCreated} />
        </Link>
        {version && <VersionShortSummary topicId={id} version={version} index={index} />}
        <TopicCardFooter authors={authors} countComments={countComments} topicId={id} />
      </div>
    </Card>
  );
};
