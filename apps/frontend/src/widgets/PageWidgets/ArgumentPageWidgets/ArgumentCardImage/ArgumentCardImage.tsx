'use client';
import { type FC } from 'react';

import styles from './ArgumentCardImage.module.scss';
import { ImageLoader } from '@libs/ui-components/ImageLoader';
import type { TArgumentCardImageProps } from './ArgumentCardImage.models';

export const ArgumentCardImage: FC<TArgumentCardImageProps> = ({ imagePreview }) => {
  return (
    <div className={styles.topicCard}>
      <ImageLoader
        src={imagePreview}
        alt='card_img'
        width={396}
        height={200}
        unoptimized
        className={styles.imageArgument}
        fill
      />
    </div>
  );
};
