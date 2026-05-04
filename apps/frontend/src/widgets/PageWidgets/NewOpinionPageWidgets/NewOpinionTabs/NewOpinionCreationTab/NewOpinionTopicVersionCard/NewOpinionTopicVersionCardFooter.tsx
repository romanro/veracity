import { RoundedButton } from '@/libs/ui-components/Buttons/RoundedButton';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@libs/hooks/useToast/useToast';

type TNewOpinionTopicVersionCardFooterProps = {
  isPublishDisabled?: boolean;
  onPublish?: () => void;
  onCancel?: () => void;
  isPublishing?: boolean;
};
export const NewOpinionTopicVersionCardFooter: FC<TNewOpinionTopicVersionCardFooterProps> = ({
  isPublishDisabled,
  onPublish,
  onCancel,
  isPublishing = false,
}) => {
  const { t } = useTranslation('newOpinionPage');

  const toast = useToast();

  const handlePublish = () => {
    if (!isPublishDisabled) {
      onPublish?.();
    } else {
      toast.error(t('publishErrorDisabled'));
    }
  };

  return (
    <footer className='flex gap-4'>
      <RoundedButton onClick={handlePublish}>
        {isPublishing ? t('publishing') || 'Publishing...' : t('publish')}
      </RoundedButton>
      <RoundedButton variant='outlined' onClick={onCancel} disabled={isPublishing}>
        {t('cancel')}
      </RoundedButton>
    </footer>
  );
};
