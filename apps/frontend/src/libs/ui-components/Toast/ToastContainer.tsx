'use client';

import { type FC, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import { removeToast } from '@/store/toastSlice';
import { Toast } from './Toast';
import { type ToastContainerProps } from './Toast.models';
import styles from './ToastContainer.module.scss';

export const ToastContainer: FC<ToastContainerProps> = ({ position = 'top-right' }) => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: any) => state.toast.toasts);

  const handleClose = useCallback(
    (id: string) => {
      dispatch(removeToast(id));
    },
    [dispatch]
  );

  const positionClass = {
    'top-right': styles.topRight,
    'top-left': styles.topLeft,
    'bottom-right': styles.bottomRight,
    'bottom-left': styles.bottomLeft,
    'top-center': styles.topCenter,
    'bottom-center': styles.bottomCenter,
  }[position];

  return (
    <div className={classNames(styles.toastContainer, positionClass)}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast: any) => (
          <Toast key={toast.id} toast={toast} onClose={handleClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};
