import { type TArgument } from '@/core/models/Argument.model';

export type TCardArgumentCreateProps = {
  item: TArgument;
  className?: string;
  onContextMenu: boolean;
  showContextMenu: () => void;
  onEnterDeleteArgument?: (idArgument: string) => void;
};
