'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import classNames from 'classnames';
import { type ToastProps, DEFAULT_TOAST_DURATION } from './Toast.models';
import styles from './Toast.module.scss';
import { CloseTimer } from './CloseTimer';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

export const Toast: FC<ToastProps> = ({ toast, onClose }) => {
  const Icon = iconMap[toast.type];
  const duration = toast.duration ?? DEFAULT_TOAST_DURATION;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={classNames(styles.toast, styles[toast.type])}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.iconWrapper}>
        <Icon className={classNames(styles.icon, styles[toast.type])} />
      </div>

      <div className={styles.content}>
        <p className={styles.message}>{toast.message}</p>
      </div>

      <CloseTimer
        duration={duration}
        onClose={() => onClose(toast.id)}
        toastType={toast.type}
      />
    </motion.div>
  );
};
