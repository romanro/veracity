import { type FC } from 'react';
import { UserDotAvatar } from '@libs/ui-components/UserDotAvatar';
import { useTranslation } from 'react-i18next';
import styles from './AddItemButton.module.scss';

interface IAddItemButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const AddItemButton: FC<IAddItemButtonProps> = ({ onClick, disabled }) => {
  const { t } = useTranslation('newOpinionPage');

  return (
    <button disabled={disabled} className={styles.addButton} onClick={onClick}>
        <UserDotAvatar size={24} />
      <p className='flex w-full items-center gap-4 '>{t('newTextEntityPromt')}</p>
    </button>
  );
};
