import { Card } from '@libs/ui-components/Card';
import { Skeleton } from '@libs/ui-components/Skeleton';

export const OpinionsListSkeleton = () => (
  <Card>
    <Skeleton count={5} shimmerProps={{ width: '100%', height: 150 }} />
  </Card>
);
