import { ImageLoader } from '@libs/ui-components/ImageLoader';
import { type FC } from 'react';
import styles from './VersionImage.module.scss';
import classNames from 'classnames';

export const VersionImage: FC<{ src: string; alt?: string; className?: string }> = ({ src, alt = '', className }) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <ImageLoader src={src} alt={alt} width={150} unoptimized className={classNames(styles.image, className)} fill />
    </div>
  );
};
