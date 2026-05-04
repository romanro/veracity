import { type FC } from 'react';
import classNames from 'classnames';
import { UserDotAvatar } from '@libs/ui-components/UserDotAvatar';
import styles from './HeadingSummary.module.scss';
import type { ArgumentListItem } from '@core/api/models/Argument.api.models';

export type THeadingSummaryProps = {
  item?: ArgumentListItem;
};

export const HeadingSummary: FC<THeadingSummaryProps> = ({ item }) => {
  if (!item) return null;
  const HeadingTag = item.type.replace('heading', 'h') as 'h1' | 'h2' | 'h3';
  const text = item.title ?? item.text;
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <UserDotAvatar size={22} />
      </div>
      <div className={classNames(styles.line, styles[`line-${item.type}`],)} />
      <HeadingTag className={classNames(styles.heading, styles[item.type], 'break-all')}>
        {text}
      </HeadingTag>
    </div>
  );
};
