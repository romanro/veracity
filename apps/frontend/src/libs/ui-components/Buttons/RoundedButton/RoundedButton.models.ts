import type { ButtonHTMLAttributes, MutableRefObject } from 'react';

export type RoundedButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outlined' | 'link';

export type TRoundedButtonProps = {
  variant?: RoundedButtonVariant;
  ref?: MutableRefObject<HTMLButtonElement | null>;
} & ButtonHTMLAttributes<HTMLButtonElement>;
