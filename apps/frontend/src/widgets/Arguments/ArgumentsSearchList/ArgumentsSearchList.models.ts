import React from 'react';
import { type TMultiResponse } from '@core/api/models/Response.model';
import { type TArgument } from '@/core/models/Argument.model';

export type TArgumentsSearchListProps = Partial<TMultiResponse<TArgument>> & {
  isLoading: boolean;
  columns?: 1 | 2;
} & {
  onContextMenu: boolean;
  showContextMenu: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, argument: TArgument) => void;
  onClick?: (item: TArgument, event?: React.MouseEvent<HTMLButtonElement>) => void;
};
