'use client';
import { type FC } from 'react';
import { type TRoundedButtonProps } from './RoundedButton.models';
import styles from './RoundedButton.module.scss';
import classnames from 'classnames';

export const RoundedButton: FC<TRoundedButtonProps> = ({
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
