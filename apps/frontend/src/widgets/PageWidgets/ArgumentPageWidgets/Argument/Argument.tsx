import { initServerI18n } from '@/i18n/serverInit';
import { Avatar } from '@libs/ui-components/Avatar';
import { type TArgument } from '@core/models/Argument.model';
import { Card } from '@libs/ui-components/Card';
import classNames from 'classnames';
import { type FC } from 'react';
import { Dot } from 'lucide-react';
import { formatDate } from '@libs/utils/date/dateFormat.utils';
import { getAuthorName } from '@/core/utils/authors/autors.utils';

type TArgumentProps = {
  hasTopic?: boolean;
  argument?: TArgument;
  locale?: string;
};
export const Argument: FC<TArgumentProps> = async ({ hasTopic, argument, locale = 'en' }) => {
  const i18n = await initServerI18n(locale);
  const t = i18n.getFixedT(locale, 'argumentPage');

  const { title, authors, createdDate } = argument ?? {};
  return (
    <Card className={classNames({ '!rounded-t-none': hasTopic }, 'mt-[1px] mb-4')}>
      <div className='flex flex-col gap-4 p-4'>
        <header className='flex items-center gap-2'>
          <Avatar avatar={authors?.[0]?.avatar} />
          <span>{getAuthorName(authors?.[0])}</span>
          <Dot color='var(--color-text-secondary)' />
          <span className='text-(--color-text-secondary) capitalize'>{t('argument')}</span>
        </header>
        {title && <p>{title}</p>}
        <footer className='flex items-center gap-2'>
          {createdDate && (
            <span className='text-sm text-(--color-text-secondary)'>
              {formatDate(createdDate, { includeTime: true })}
            </span>
          )}
        </footer>
      </div>
    </Card>
  );
};
