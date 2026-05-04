import { useState } from 'react';
import type { TUseArgumentsButtonStateProps } from './useArgumentButtonState.models';
import { getActionArgument } from '../../../widgets/PageWidgets/ArgumentPageLeft/ArgumentPageLeft.utils';

export const useArgumentsButtonState = ({ typeArguments }: TUseArgumentsButtonStateProps) => {
  const [isProof, setIsProof] = useState<boolean>(getActionArgument(typeArguments as string | number));
  const [onPublishButton, setOnPublishButton] = useState<boolean>(true);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  return {
    isProof,
    setIsProof,
    onPublishButton,
    setOnPublishButton,
    showCancelModal,
    setShowCancelModal,
  };
};
