import { type ReactNode } from 'react';

export type TModalContainerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};
