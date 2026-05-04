import { type ArgumentTab } from '@/widgets/OpinionsList/useInfiniteOpinions';

export type TNewArgumentInputProps = {
  tab: ArgumentTab;
  buttonConfirm?: boolean;

  onEnterConfirm?: () => void;
};
