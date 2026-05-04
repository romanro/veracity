import { type FC } from 'react';
import styles from './UserDotAvatar.module.scss';

type TUserDotAvatarProps = { size?: number };
export const UserDotAvatar: FC<TUserDotAvatarProps> = ({ size = 32 }) => {
  return <div className={styles.dot} style={{ width: size, height: size }} />;
};
