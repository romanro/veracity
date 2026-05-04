import { type ImageProps } from 'next/image';
import { type CSSProperties } from 'react';

export type TImageLoaderProps = Omit<ImageProps, 'src'> & {
  src: string;
  unoptimized?: boolean;
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: CSSProperties['objectPosition'];
  className?: string;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  fill?: boolean;
};
