import { BadgeCheck, BadgeMinus, MessageCircleMore } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { type FC } from 'react';

export const ArgumentSummaryFooter: FC<{
  countComments: number;
  countConfirmations: number;
  countRefutations: number;
}> = ({ countComments, countConfirmations, countRefutations }) => {
  const { t } = useTranslation('argumentPage');
  return (
    <footer className='flex w-[100%] flex-row items-center justify-between'>
      <ul className='flex flex-row items-center gap-3 text-sm text-(--color-text-secondary)'>
        <li className='flex flex-row items-center gap-1'>
          <BadgeCheck size={16} />
          {`${countConfirmations} ${t('countConfirmations')}`}
        </li>
        <li className='flex flex-row items-center gap-1'>
          <BadgeMinus size={16} />
          {`${countRefutations} ${t('countRefutations')}`}
        </li>
        <li className='flex flex-row items-center gap-1'>
          <MessageCircleMore size={16} />
          {`${countComments} ${t('countComments')}`}
        </li>
      </ul>
    </footer>
  );
};
