import { formatDate } from '@libs/utils/date/dateFormat.utils';
import { type FC } from 'react';
import styles from './TopicCardHeader.module.scss';
import classNames from 'classnames';

type TTopicCardHeaderProps = {
  title: string;
  dateCreated?: Date;
};
export const TopicCardHeader: FC<TTopicCardHeaderProps> = ({ title, dateCreated }) => {
  return (
    <header className='flex-column max-w-full items-center justify-between'>
      <h5 className={classNames('flex max-w-full items-center justify-between text-sm', styles.hederH5)}>
        <span>Topic</span>
        {dateCreated && <span>{formatDate(dateCreated)}</span>}
      </h5>
      <h3 className={classNames('max-w-full', styles.title)}>{title}</h3>
    </header>
  );
};
