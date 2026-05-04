import { type FC } from 'react';

import type { TShimmerPlaceholderProps } from '../ShimmerPlaceholder/ShimmerPlaceholder.models';
import { ShimmerPlaceholder } from '../ShimmerPlaceholder';
import { renderComponentMap } from './Skeleton.utils';

type Props = { shimmerProps: TShimmerPlaceholderProps; count?: number };

export const Skeleton: FC<Props> = ({ shimmerProps, count = 5 }) => {
  return (
    <>
      {renderComponentMap(count, (i) => (
        <ShimmerPlaceholder key={i} {...shimmerProps} />
      ))}
    </>
  );
};
