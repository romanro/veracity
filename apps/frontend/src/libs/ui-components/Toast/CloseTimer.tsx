'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import classNames from 'classnames';
import type { CloseTimerProps } from './Toast.models';
import styles from './CloseTimer.module.scss';

export const CloseTimer: FC<CloseTimerProps> = ({ duration, onClose, toastType }) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Auto-close when timer completes
        onClose();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration, onClose]);

  // Circle properties
  const radius = 9;
  const strokeWidth = 2;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={onClose}
      className={classNames(styles.closeTimerButton, styles[toastType])}
      aria-label="Close notification"
      type="button"
    >
      <svg
        height={radius * 2}
        width={radius * 2}
        className={styles.progressCircle}
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={styles.backgroundCircle}
        />
        {/* Progress circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={styles.progressCircleStroke}
        />
      </svg>
      <X className={styles.closeIcon} />
    </button>
  );
};
