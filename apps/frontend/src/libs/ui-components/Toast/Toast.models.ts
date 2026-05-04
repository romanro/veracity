import { type Toast as ToastData, type ToastType } from '@/store/toastSlice';

export interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export interface CloseTimerProps {
  duration: number;
  onClose: () => void;
  toastType: ToastType;
}

export const DEFAULT_TOAST_DURATION = 5000; // 5 seconds
