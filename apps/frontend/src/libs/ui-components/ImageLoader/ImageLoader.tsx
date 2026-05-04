'use client';

import NextImage from 'next/image';
import { Suspense, useState, type FC } from 'react';
import { ShimmerPlaceholder } from '../ShimmerPlaceholder';
import classnames from 'classnames';
import { type TImageLoaderProps } from './ImageLoader.models';
import { useResolvedImageSrc } from './useResolvedImageSrc';

export const ImageLoader: FC<TImageLoaderProps> = ({
  src,
  alt,
  unoptimized = false,
  objectFit = 'cover',
  objectPosition = 'center',
  className,
  width,
  height,
  fill = false,
  ...rest
}) => {
  const [isError, setIsError] = useState(false);
  const resolvedSrc = useResolvedImageSrc(src);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
      }}
    >
      <Suspense fallback={<ShimmerPlaceholder width={width} height={height} className={className} />}>
        {isError || !src ? null : (
          <NextImage
            {...rest}
            src={resolvedSrc}
            alt={alt}
            onError={() => {
              setIsError(true);
            }}
            unoptimized={unoptimized}
            fill={fill}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            style={{
              objectFit,
              objectPosition,
              ...(rest.style || {}),
            }}
            className={classnames('transition-opacity duration-300', className)}
            loading='lazy'
          />
        )}
      </Suspense>
    </div>
  );
};
