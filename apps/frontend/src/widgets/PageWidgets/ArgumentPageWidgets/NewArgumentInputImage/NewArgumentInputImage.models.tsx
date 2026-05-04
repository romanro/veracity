export type TNewArgumentInputImageProps = {
  setPreview: (value: string | null) => void;
  preview: string | null;
  isTextArgument?: boolean;
  onEnterSave?: () => void;
  onEnterCancel?: () => void;
};
