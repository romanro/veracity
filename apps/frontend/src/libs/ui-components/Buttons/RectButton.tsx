'use client';
import { type FC } from 'react';
import { type TButtonProps } from './Buttons.models';
import styles from './RectButton.module.scss';

export const RectButton: FC<TButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button className={`${styles.button ?? ''} ${className} rounded-md p-3`} {...props}>
      {children}
    </button>
  );
};
