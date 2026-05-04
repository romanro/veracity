import { type TArgument } from '@/core/models/Argument.model';

export type TArgumentLineButtonProps = {
  disabled?: boolean;
  item: TArgument;
  onContextMenu: boolean;
  showContextMenu: () => void;
};

export const arrContextMenu = [
  { nameLink: 'Report', routerLink: 'test' },
  { nameLink: 'Denuciar', routerLink: 'test' },
];
