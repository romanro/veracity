import { useRef, useCallback, useEffect, type MutableRefObject } from 'react';
import type { Dispatch } from 'react';
import type { TArgument } from '@core/models/Argument.model';
import type { TNewOpinionArgumentsListRef } from '../../../NewOpinionArgumentsList';
import type { NewOpinionCreationAction } from '../NewOpinionCreationTab.types';
import { createArgumentItem } from '../../../NewOpinionArgumentsList/NewOpinionArgumentsList.utils';
import { ANIMATION_DURATION_MS } from '../NewOpinionCreationTab.constants';

interface IUseArgumentAnimationParams {
  argumentsListRef: MutableRefObject<TNewOpinionArgumentsListRef | null>;
  dispatch: Dispatch<NewOpinionCreationAction>;
}

/**
 * Calculate center position of a button element
 */
const getButtonCenterPosition = (buttonElement: HTMLButtonElement) => ({
  x: buttonElement.getBoundingClientRect().left + buttonElement.getBoundingClientRect().width / 2,
  y: buttonElement.getBoundingClientRect().top + buttonElement.getBoundingClientRect().height / 2,
});

/**
 * Custom hook to handle argument reuse animation
 * - Manages animation timeout
 * - Calculates button position for animation start
 * - Adds argument to list after animation
 * - Cleans up timeout on unmount
 */
export const useArgumentAnimation = ({ argumentsListRef, dispatch }: IUseArgumentAnimationParams) => {
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleArgumentReuse = useCallback(
    (argument: TArgument, buttonElement: HTMLButtonElement) => {
      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Get button position for animation start
      const startPos = getButtonCenterPosition(buttonElement);

      // Start animation
      dispatch({
        type: 'START_ANIMATION',
        payload: { argument, position: startPos },
      });

      // Add to list after animation completes
      animationTimeoutRef.current = setTimeout(() => {
        if (argumentsListRef.current) {
          const argumentItem = createArgumentItem(argument);
          dispatch({ type: 'ADD_USED_ARGUMENT', payload: argument });
          argumentsListRef.current.addItem(argumentItem);
        }
        dispatch({ type: 'END_ANIMATION' });
        animationTimeoutRef.current = null;
      }, ANIMATION_DURATION_MS);
    },
    [argumentsListRef, dispatch]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return {
    handleArgumentReuse,
  };
};
