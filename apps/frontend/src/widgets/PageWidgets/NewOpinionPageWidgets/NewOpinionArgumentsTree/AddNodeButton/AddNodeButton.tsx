import { UserDotAvatar } from '@libs/ui-components/UserDotAvatar';
import { useTranslation } from 'react-i18next';

export const AddNodeButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => {
  const { t } = useTranslation('newOpinionPage');

  return (
    <button disabled={disabled} className='mt-4 flex w-full items-center gap-2 p-1' onClick={onClick}>
      <div className='p-1'>
        <UserDotAvatar size={24} />
      </div>
      <p className='flex w-full items-center gap-4 py-4'>{t('newTextEntityPromt')}</p>
    </button>
  );
};
