import { useMemo } from 'react';
import type { TListDocument } from '../../../NewOpinionArgumentsList/NewOpinionArgumentsList.models';
import { calculateOpinionStrength, type IOpinionStrength } from '../../../NewOpinionArgumentsList/NewOpinionArgumentsList.utils';

/**
 * Custom hook to calculate opinion strength based on list state
 * Recalculates whenever the list changes
 */
export const useOpinionStrength = (currentList: TListDocument | null): IOpinionStrength => {
  return useMemo(() => {
    if (!currentList) {
      return {
        reusedCount: 0,
        newTextCount: 0,
        totalCount: 0,
        strengthPercentage: 0,
      };
    }

    return calculateOpinionStrength(currentList);
  }, [currentList]);
};
