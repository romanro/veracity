import { memo, type FC } from 'react';
import styles from './OpinionStrengthIndicator.module.scss';
import { Card } from '@libs/ui-components/Card';

interface IOpinionStrengthIndicatorProps {
  reusedCount: number;
  totalCount: number;
}

const MAX_SEGMENTS = 70;
const GREEN_THRESHOLD = Math.round(MAX_SEGMENTS * (2 / 3)); // First 66.66% = segments 0-33 orange, rest green

export const OpinionStrengthIndicator: FC<IOpinionStrengthIndicatorProps> = memo(({ reusedCount, totalCount }) => {
  // Calculate how many segments should be filled based on the ratio
  const filledSegments = totalCount > 0 ? Math.round((reusedCount / totalCount) * MAX_SEGMENTS) : 0;

  // Determine segment class based on position and fill state
  const getSegmentClass = (index: number): string => {
    const isFilled = index < filledSegments;
    const isOrangeZone = index < GREEN_THRESHOLD;

    if (isOrangeZone) {
      return isFilled ? styles.orangeFilled : styles.orangeUnfilled;
    } else {
      return isFilled ? styles.greenFilled : styles.greenUnfilled;
    }
  };

  return (
    <Card className={styles.container}>
      <div className={styles.header}>The more quotes, the stronger your article</div>
      <div className={styles.segmentBar}>
        {Array.from({ length: MAX_SEGMENTS }).map((_, index) => (
          <div key={index} className={`${styles.segment} ${getSegmentClass(index)}`} />
        ))}
      </div>
    </Card>
  );
});

OpinionStrengthIndicator.displayName = 'OpinionStrengthIndicator';
