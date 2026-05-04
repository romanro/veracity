import { Card } from '@libs/ui-components/Card';
import { type TVersion } from '@core/models/Version.model';
import { type FC } from 'react';
import styles from './VersionPreview.module.scss';
import { AuthorsSummary } from '@widgets/AuthorsSummary/AuthorsSummary';
import { VersionScore } from './VersionScore/VersionScore';
import { VersionImage } from './VersionImage/VersionImage';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTopicVersionPath } from '@/libs/hooks/useTopicVersionPath';
import { ShareButton } from '../../../libs/ui-components/Buttons/ShareButton';
import { Bookmark } from 'lucide-react';
import { CommentsSummary } from '../../CommentsSummary';
import { IconButton } from '../../../libs/ui-components/Buttons/IconButton/IconButton';

export const VersionPreview: FC<{ version: TVersion }> = ({ version }) => {
  const { title, description, authors = [], reliability, srcImg, id } = version;

  const { topicId } = useParams();
  const { getPath } = useTopicVersionPath();
  const normalizedTopicId = Array.isArray(topicId) ? topicId[0] : topicId;
  const href = getPath({ topicId: normalizedTopicId as string, versionId: id });

  return (
    <Card className={styles.topicCard}>
      <div className='flex items-stretch gap-4'>
        <VersionScore reliability={reliability} />
        <article className='flex flex-2 flex-col gap-4 px-6 py-4'>
          <Link className='flex flex-col gap-4' href={href}>
            <h3 className={styles.titleText}>{title}</h3>
            {description && <p className={styles.descriptionText}>{description}</p>}
          </Link>
          <footer className='my-4 mr-2 flex w-full items-center justify-between gap-3'>
            <div className='flex gap-3'>
              <AuthorsSummary authors={authors} limit={3} />
              <CommentsSummary countComments={0} />
            </div>
            <div className='flex gap-3'>
              <IconButton icon={Bookmark} />
              <ShareButton topicId={normalizedTopicId} isTopic={true} />
            </div>
          </footer>
        </article>
        {srcImg && <VersionImage src={srcImg} alt={title} className={styles.imageWrapper} />}
      </div>
    </Card>
  );
};
