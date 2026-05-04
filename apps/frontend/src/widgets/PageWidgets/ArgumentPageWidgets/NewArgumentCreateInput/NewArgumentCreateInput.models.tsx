import { type ArgumentTab } from '@/widgets/OpinionsList/useInfiniteOpinions';

export type TNewArgumentCreateInputProps = {
  tab: ArgumentTab;
  onEnterConfirm: (value: string) => void;
  textNewArgument: string;
  isImage?: boolean;
  setPreview?: (value: string | null) => void;
  preview?: string | null;
  onEnterCancelArgument?: () => void;
};
