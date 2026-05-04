import { type FC } from 'react';
import { type TShimmerPlaceholderProps } from './ShimmerPlaceholder.models';
import classnames from 'classnames';

export const ShimmerPlaceholder: FC<TShimmerPlaceholderProps> = ({
  width = '100%',
  height = '100%',
  isAnimated = true,
  className = '',
}) => (
  <div
    className={classnames(
      { 'animate-pulse': isAnimated },
      'shadow-md',
      'rounded-lg',
      'bg-(--color-light-500)',
      className
    )}
    style={{ width: width, height: height }}
  />
);
