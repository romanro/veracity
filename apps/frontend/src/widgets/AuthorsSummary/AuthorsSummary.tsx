import { type FC } from 'react';
import { type TAuthorsSummaryProps } from './AuthorsSummary.models';
import { Avatar } from '@/libs/ui-components/Avatar/Avatar';
import classNames from 'classnames';
import styles from './AuthorsSummary.module.scss';
import { getPluralForm } from '@/libs/utils/string/getPluralForm.util';

export const AuthorsSummary: FC<TAuthorsSummaryProps> = ({ authors, limit }) => {
  if (!authors || authors.length === 0) {
    return null;
  }

  const authorsCount = authors.length;
  const displayedAuthors = limit ? authors.slice(0, limit) : authors;

  return (
    <div className={classNames('justify-flex-start flex items-center gap-2', styles.authorsList)}>
      <ul className='flex'>
        {displayedAuthors.map((author) => {
          const { id, avatar, name } = author;
          return (
            <li key={id} className={classNames('flex items-center', styles.listItem)}>
              <Avatar avatar={avatar} alt={name} className={styles.ava} />
            </li>
          );
        })}
      </ul>
      <span>{getPluralForm({ count: authorsCount, single: 'author', multi: 'authors' })}</span>
    </div>
  );
};
