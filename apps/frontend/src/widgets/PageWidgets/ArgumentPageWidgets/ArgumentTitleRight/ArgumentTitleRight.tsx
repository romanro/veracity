import { type FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ArgumentTitleRight.module.scss';
import classNames from 'classnames';

const STORAGE_KEY = 'argumentTitleRight:expanded';

export const ArgumentTitleRight: FC = () => {
  const { t } = useTranslation('argumentPage');
  const [isExpanded, setIsExpanded] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsExpanded(stored === 'true');
    }
  }, []);

  // Toggle and save to localStorage
  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem(STORAGE_KEY, String(newState));
  };

  return (
    <section className='flex flex-col gap-3 p-2 text-left'>
      <div className='flex items-center justify-between'>
        <h2 className='text-(length:--font-size-md) font-(--font-weight-medium) break-all text-(--color-text-primary)'>
          {t('titlePartRight')}
        </h2>
        <button
          onClick={toggleExpanded}
          className={styles.toggleButton}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          type='button'
        >
          <svg
            className={classNames(styles.chevron, { [styles.chevronExpanded]: isExpanded })}
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M5 7.5L10 12.5L15 7.5'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
      <p className={classNames(styles.titleArgument, { [styles.collapsed]: !isExpanded })}>
        {t('titleArgumentConfirmationRight')}
      </p>
    </section>
  );
};
