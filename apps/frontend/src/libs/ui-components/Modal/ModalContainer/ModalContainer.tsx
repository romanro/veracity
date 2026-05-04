import React from 'react';
import { type TModalContainerProps } from './ModalContainer.models';

export const ModalContainer = ({ isOpen, onClose, children }: TModalContainerProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='absolute inset-0' onClick={onClose} />

      <div className='relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
