import { Card } from '@libs/ui-components/Card';
import { MessageCircleWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ErrorMessage = () => {
  const { t } = useTranslation('newOpinionPage');
  return (
    <Card className='!p-6'>
      <div className='flex items-center gap-4'>
        <MessageCircleWarning size={40} />
        <p>{t('topicVersionError')}</p>
      </div>
    </Card>
  );
};
