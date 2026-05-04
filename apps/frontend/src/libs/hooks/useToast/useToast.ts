import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addToast, clearAllToasts, type ToastType } from '@/store/toastSlice';
import { DEFAULT_TOAST_DURATION } from '@/libs/ui-components/Toast/Toast.models';

interface ToastOptions {
  duration?: number;
}

export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = useCallback(
    (message: string, type: ToastType, options?: ToastOptions) => {
      dispatch(
        addToast({
          message,
          type,
          duration: options?.duration ?? DEFAULT_TOAST_DURATION,
        })
      );
    },
    [dispatch]
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'success', options);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'error', options);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'info', options);
    },
    [showToast]
  );

  const clear = useCallback(() => {
    dispatch(clearAllToasts());
  }, [dispatch]);

  return {
    success,
    error,
    info,
    clear,
  };
};
