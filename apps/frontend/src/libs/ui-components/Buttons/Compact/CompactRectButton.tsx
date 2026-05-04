'use client';
import { type FC } from 'react';
import styles from './CompactRectButton.module.scss';
import classnames from 'classnames';
import type { TRoundedButtonProps } from '../RoundedButton/RoundedButton.models';

type TCompactRectButtonProps = TRoundedButtonProps;

export const CompactRectButton: FC<TCompactRectButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  className,
  ...rest
}) => {
  return (
    <button
      className={classnames(styles.button, styles[variant], disabled && styles.disabled, className)}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
