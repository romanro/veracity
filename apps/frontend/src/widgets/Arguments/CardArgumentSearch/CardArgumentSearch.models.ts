import { type TArgument } from '@/core/models/Argument.model';
import type { MouseEvent } from 'react';

export type TCardArgumentSearchProps = {
  item: TArgument;
  className?: string;
  newArgument?: boolean;
  onContextMenu: boolean;
  showContextMenu?: () => void;
  onClick?: (item: TArgument, event?: MouseEvent<HTMLButtonElement>) => void;
};
