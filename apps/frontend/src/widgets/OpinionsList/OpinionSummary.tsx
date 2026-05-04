import { type TOpinionItem } from '@/core/models/Opinion.model';
import { type FC } from 'react';
import { ArgumentSummaryHeader } from '../ArgumentsList/ArgumentSummary/ArgumentSummaryHeader';
import { ArgumentSummaryFooter } from '../ArgumentsList/ArgumentSummary/ArgumentSummaryFooter';
import classNames from 'classnames';
import styles from '../ArgumentsList/ArgumentSummary/ArgumentSummary.module.scss';

export const OpinionSummary: FC<{ opinion: TOpinionItem }> = ({ opinion }) => {
  const { text, createdDate, author, countComments, countConfirmations, countRefutations } = opinion;

  return (
    <div className='flex flex-col px-2'>
      <ArgumentSummaryHeader createdDate={createdDate} author={author} />
      <div className={classNames('flex flex-col gap-2 py-2 pb-10 pl-6', styles.summaryText)}>
        <p>{text}</p>
        <ArgumentSummaryFooter
          countComments={countComments}
          countConfirmations={countConfirmations}
          countRefutations={countRefutations}
        />
      </div>
    </div>
  );
};
