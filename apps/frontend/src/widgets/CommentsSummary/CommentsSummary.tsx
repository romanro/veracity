import classNames from 'classnames';
import type { FC } from 'react';
import styles from './CommentsSummary.module.scss';
import { getPluralForm } from '@libs/utils/string/getPluralForm.util';
import { MessageCircleMore } from 'lucide-react';

type TCommentsSummaryProps = { countComments: number };

export const CommentsSummary: FC<TCommentsSummaryProps> = ({ countComments }) => {
  return (
    <div className={classNames('justify-flex-start flex items-center gap-1', styles.commentsSummary)}>
      <MessageCircleMore size={16} />
      <span>{getPluralForm({ count: countComments, single: 'Comment', multi: 'Comments' })}</span>
    </div>
  );
};
