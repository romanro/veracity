'use client';
import type { InputHTMLAttributes, FC } from 'react';
import styles from './RoundedInputField.module.scss';
import classNames from 'classnames';
import { type RoundedButtonVariant } from '../../Buttons/RoundedButton/RoundedButton.models';

type TRoundedInputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: RoundedButtonVariant;
};

export const RoundedInputField: FC<TRoundedInputFieldProps> = ({
  variant = 'primary',
  disabled,
  className,
  ...rest
}) => {
  return (
    <input
      className={classNames(styles['rounded-input'], styles[variant], disabled && styles.disabled, className)}
      disabled={disabled}
      {...rest}
    />
  );
};
