import { type FC } from 'react';
import { type TModalConfirmationProps } from './ModalConfirmation.models';
import { ModalContainer } from '../ModalContainer';
import { RoundedButton } from '../../Buttons/RoundedButton';

export const ModalConfirmation: FC<TModalConfirmationProps> = ({
  headerText,
  bodyText,
  showCancelModal,
  onClose,
  handleDiscard,
  confirmBtnLabel = 'Discard',
  cancelBtnLabel = 'Cancel',
}) => {
  return (
    <ModalContainer isOpen={showCancelModal} onClose={onClose}>
      <h2 className='mb-2 text-lg font-semibold'>{headerText}</h2>
      <p className='mb-4 text-sm break-words whitespace-normal text-gray-700'>{bodyText}</p>
      <div className='flex justify-end space-x-2'>
        <RoundedButton variant='outlined' onClick={onClose}>
          {cancelBtnLabel}
        </RoundedButton>
        <RoundedButton onClick={handleDiscard}>{confirmBtnLabel}</RoundedButton>
      </div>
    </ModalContainer>
  );
};
