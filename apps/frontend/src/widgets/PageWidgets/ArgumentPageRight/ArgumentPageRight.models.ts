import { type TMainParamsProps } from '@/core/models/main';

export type TArgumentPageRightProps = {
  mainParams: TMainParamsProps;
  onItemDropped?: (id: string) => void;
  droppedItemId?: string | null;
};
