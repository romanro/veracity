import { type TArgument } from '@/core/models/Argument.model';

export type TCardArgumentProps = {
  item: TArgument;
  className?: string;
  connection: boolean;
  onContextMenu: boolean;
  showContextMenu: () => void;
};
