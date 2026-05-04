import type { TDropdownMenuOption } from '@libs/ui-components/DropdownMenu/DropdownMenu.models';
import type { TNodeType } from '../../NewOpinionArgumentsTree/NewOpinionArgumentsTree.models';

export type TNodeEditBarProps = {
  options: TDropdownMenuOption<TNodeType>[];
  type?: TNodeType;
  onTypeChanged: (value: TDropdownMenuOption<TNodeType>) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
  isValid: boolean;
  canBeDeleted: boolean;
  showTypeSelect?: boolean;
  // Image upload props (optional)
  enableImageUpload?: boolean;
  imagePreview?: string | null;
  onImageCropped?: (blob: Blob, url: string, base64: string) => void;
  onImageRemove?: () => void;
};
