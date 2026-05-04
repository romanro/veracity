import { SearchField } from '@libs/ui-components/SearchField';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { TQuoteSearchProps } from './QuoteSearch.models';

export const QuoteSearch: FC<TQuoteSearchProps> = ({ initialValue, onSearch }) => {
  const { t } = useTranslation('argumentPage');
  return (
    <div className='flex flex-col gap-2 text-left'>
      <p className='text-(length:--font-size-sm) text-(--color-text-primary)'>{t('findArgumentTitle')}</p>
      <SearchField
        placeholder={t('searchArgumentPromt')}
        showFindButton={false}
        initialValue={initialValue}
        onSearch={onSearch}
        showSearchIcon
        submitOnType
        delay={1000}
        classNames={{ label: '!p-0' }}
      />
    </div>
  );
};
