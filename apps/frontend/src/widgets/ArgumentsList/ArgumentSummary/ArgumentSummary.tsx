import { type TArgument } from '@/core/models/Argument.model';
import { useMemo, type FC } from 'react';
import { ArgumentSummaryHeader } from './ArgumentSummaryHeader';
import { ArgumentSummaryFooter } from './ArgumentSummaryFooter';
import classNames from 'classnames';
import styles from './ArgumentSummary.module.scss';
import { usePathname } from 'next/navigation';
import { buildArgumentPath } from './ArgumentSummary.utils';
import Link from 'next/link';
import { ArgumentCardImage } from '@/widgets/PageWidgets/ArgumentPageWidgets/ArgumentCardImage';

export const ArgumentSummary: FC<{ argument: TArgument }> = ({ argument }) => {
  const { text, createdDate, author, countComments, countConfirmations, countRefutations, id, imgUrl } = argument;

  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newPath = useMemo(() => buildArgumentPath(pathname, id), [id]);

  return (
    <div className='flex flex-col px-2'>
      <ArgumentSummaryHeader createdDate={createdDate} author={author} />
      <div className={classNames('flex flex-col gap-2 py-2 pb-10 pl-6', styles.summaryText)}>
        <Link href={newPath}>
          <p className='break-all'>{text}</p>
        </Link>
        {imgUrl && <ArgumentCardImage imagePreview={imgUrl} />}
        <ArgumentSummaryFooter
          countComments={countComments}
          countConfirmations={countConfirmations}
          countRefutations={countRefutations}
        />
      </div>
    </div>
  );
};
