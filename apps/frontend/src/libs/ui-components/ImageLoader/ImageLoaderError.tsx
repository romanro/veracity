import { type FC } from 'react';
import { ShimmerPlaceholder } from '../ShimmerPlaceholder';
import { type TImageLoaderProps } from './ImageLoader.models';
import { ImageOff } from 'lucide-react';

export const ImageLoaderError: FC<Pick<TImageLoaderProps, 'width' | 'height' | 'className'>> = ({
  width,
  height,
  className,
}) => {
  return (
    <div className='flex-center relative h-full'>
      <ShimmerPlaceholder width={width} height={height} className={className} isAnimated={false} />
      <ImageOff className='absolute' />
    </div>
  );
};
