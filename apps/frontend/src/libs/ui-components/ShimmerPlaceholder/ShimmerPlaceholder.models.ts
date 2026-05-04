import { type CSSProperties } from 'react';

export type TShimmerPlaceholderProps = {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  isAnimated?: boolean;
  className?: string;
};
