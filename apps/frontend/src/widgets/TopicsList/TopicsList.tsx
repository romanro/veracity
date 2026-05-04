import { type FC } from 'react';
import { type TTopicsListProps } from './TopicsList.models';
import { TopicsListSkeleton } from './TopicsListSkeleton/TopicsListSkeleton';
import { TopicsListEmpty } from './TopicsListEmpty/TopicsListEmpty';
import styles from './TopicsList.module.scss';
import dynamic from 'next/dynamic';
import { ShimmerPlaceholder } from '@libs/ui-components/ShimmerPlaceholder';

export const TopicCard = dynamic(
  () => import(/* webpackPreload: true */ './TopicCard/TopicCard').then((mod) => mod.TopicCard),
  {
    ssr: true,
    loading: () => <ShimmerPlaceholder height={200} />,
  }
);

export const TopicsList: FC<TTopicsListProps> = ({ data = [], isLoading, columns = 1 }) => {
  const isEmpty = data.length === 0;

  if (isLoading) return <TopicsListSkeleton />;
  if (isEmpty) return <TopicsListEmpty />;

  // Split data into two columns for masonry layout
  if (columns === 2) {
    const column1 = data.filter((_, index) => index % 2 === 0);
    const column2 = data.filter((_, index) => index % 2 === 1);

    return (
      <div className='max-w-full pt-4 pb-4'>
        <div className={styles.masonry}>
          <ul className={styles.column}>
            {column1.map((topic) => (
              <li key={topic.id} className={styles.item}>
                <TopicCard topic={topic} />
              </li>
            ))}
          </ul>
          <ul className={styles.column}>
            {column2.map((topic) => (
              <li key={topic.id} className={styles.item}>
                <TopicCard topic={topic} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Single column layout
  return (
    <div className='pt-4 pb-4'>
      <ul className='grid grid-cols-1 gap-4'>
        {data.map((topic) => (
          <li key={topic.id}>
            <TopicCard topic={topic} />
          </li>
        ))}
      </ul>
    </div>
  );
};
