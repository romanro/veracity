import React from 'react';
import { type TMultiResponse } from '@core/api/models/Response.model';
import { type TArgument } from '@/core/models/Argument.model';

export type TArgumentsCreateListProps = Partial<TMultiResponse<TArgument>> & {
  onContextMenu: boolean;
  showContextMenu: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, argument: TArgument) => void;
  onEnterDeleteArgument?: (idArgument: string) => void;
};
