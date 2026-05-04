import { Card } from '@/libs/ui-components/Card';
import { SearchX } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

export const ArgumentsListEmpty: FC = () => {
  const { t } = useTranslation('searchArguments');
  return (
    <Card className='flex w-[100%] flex-col items-center justify-center'>
      <SearchX size={60} className='m-5' />
      <h2 className='text-lg'>{t('notFound')}</h2>
      <p className='mb-5 text-(--color-text-secondary)'>{t('tryToAdjust')}</p>
    </Card>
  );
};
