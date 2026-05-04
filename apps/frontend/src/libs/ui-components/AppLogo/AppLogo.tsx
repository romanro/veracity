import { type FC } from 'react';
import styles from './AppLogo.module.scss';
import { ImageLoader } from '../ImageLoader';

const AppLogo: FC<{ logoText?: string }> = ({ logoText = 'CyberPravda' }) => {
  return (
    <div className={styles.appLogo}>
      <ImageLoader alt='' className='rounded-[50%]' width={35} height={35} src='/img/cyberAva.png' />
      <h2 className={styles.name}>{logoText}</h2>
    </div>
  );
};

export { AppLogo };
