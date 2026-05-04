import { type FC } from 'react';
import { type TButtonProps } from './Buttons.models';
import { CircleX } from 'lucide-react';

import styles from './ClearButton.module.scss'; // optional

export const ClearButton: FC<TButtonProps> = ({ className = '', ...props }) => {
  return (
    <button type='button' className={`${styles.clearButton ?? ''} ${className}`} {...props}>
      <CircleX className={styles.icon} />
    </button>
  );
};
