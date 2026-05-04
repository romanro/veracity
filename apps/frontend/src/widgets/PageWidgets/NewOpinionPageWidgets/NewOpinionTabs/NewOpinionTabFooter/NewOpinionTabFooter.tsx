import { RoundedButton } from '@/libs/ui-components/Buttons/RoundedButton';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

type TNewOpinionTabFooterProps = {
  onNextClick: () => void;
  onCancel?: () => void;
};
export const NewOpinionTabFooter: FC<TNewOpinionTabFooterProps> = ({ onNextClick, onCancel }) => {
  const { t } = useTranslation('newOpinionPage');
  return (
    <footer className='flex gap-4'>
      <RoundedButton onClick={onNextClick}>{t('next')}</RoundedButton>
      <RoundedButton variant='outlined' onClick={onCancel}>
        {t('cancel')}
      </RoundedButton>
    </footer>
  );
};
