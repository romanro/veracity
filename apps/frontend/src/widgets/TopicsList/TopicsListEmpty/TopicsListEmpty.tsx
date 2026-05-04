import { Card } from '@/libs/ui-components/Card';
import { SearchX } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

export const TopicsListEmpty: FC = () => {
  const { t } = useTranslation('searchPage');
  return (
    <Card className='flex h-full w-[100%] max-w-[700px] flex-col items-center justify-center p-6'>
      <SearchX size={60} className='m-5' />
      <h2 className='text-lg'>{t('notFound')}</h2>
      <p className='mb-5 text-(--color-text-secondary)'>{t('tryToAdjust')}</p>
    </Card>
  );
};
