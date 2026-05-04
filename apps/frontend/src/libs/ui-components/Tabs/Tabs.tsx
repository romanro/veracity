'use client';
import { useCallback, type FC } from 'react';
import styles from './Tabs.module.scss';
import type { TTab, TTabsProps } from './Tabs.models';
import classNames from 'classnames';

export const Tabs: FC<TTabsProps> = ({ tabs, onTabSelected, initiallySelected }) => {
  const onTabClick = useCallback(
    (id: TTab['id']) => {
      onTabSelected?.(id);
    },
    [onTabSelected]
  );

  if (!tabs.length) return null;

  return (
    <ul className={styles.tabs}>
      {tabs.map((tab) => (
        <li key={tab.id} className={styles.tab}>
          <button
            onClick={() => onTabClick(tab.id)}
            className={classNames(styles.tabBtn, { [styles.active]: initiallySelected === tab.id })}
            suppressHydrationWarning
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
};
